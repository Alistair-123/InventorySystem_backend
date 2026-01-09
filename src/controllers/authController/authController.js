/* eslint-disable no-undef */
import Personnel from "../../models/Personnel/Personnel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Optional: Use a proper logger in production (e.g., winston)
const logError = (context, error) => {
  console.error(`[LOGIN ERROR] ${context}:`, error);
};

export const login = async (req, res) => {
  try {
    const { personnelId, password } = req.body;

    // 1. Basic input validation
    if (!personnelId || !password) {
      return res.status(400).json({
        message: "Personnel ID and password are required.",
      });
    }

    // Optional: Basic type/tr trimming safety
    if (typeof personnelId !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: "Invalid input format.",
      });
    }

    // Trim to avoid whitespace issues
    const trimmedId = personnelId.trim();

    // 2. Find personnel (include password field)
    const personnel = await Personnel.findOne({ personnelId: trimmedId }).select('+password');
    
    if (!personnel) {
      return res.status(401).json({
        message: "Invalid personnel ID or password.",
      });
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, personnel.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid personnel ID or password.",
      });
    }

    // 4. Generate tokens
    let accessToken, refreshToken;
    try {
      accessToken = jwt.sign(
        { id: personnel._id, role: personnel.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      refreshToken = jwt.sign(
        { id: personnel._id, role: personnel.role },
        process.env.REFRESH_KEY,
        { expiresIn: '7d' }
      );
    } catch (jwtError) {
      logError("JWT generation failed", jwtError);
      return res.status(500).json({
        message: "Authentication service temporarily unavailable.",
      });
    }

    // 5. Store refresh token atomically
    try {
      await Personnel.findByIdAndUpdate(
        personnel._id,
        { refreshToken },
        { new: true }
      );
    } catch (dbError) {
      logError("Failed to update refresh token", dbError);
      // Note: We don't fail the login here — user is authenticated
      // But refresh token won't work until next login
    }

    // 6. Set HttpOnly secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Successful response
    return res.status(200).json({
      accessToken,
      personnel: {
        id: personnel._id,
        personnelId: personnel.personnelId,
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        role: personnel.role,
      },
    });

  } catch (error) {
    // Catch-all for unexpected errors (DB downtime, bcrypt issues, etc.)
    logError("Unexpected error during login", error);

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "No refresh token provided." });
        }

        const personnel = await Personnel.findOne({ refreshToken });
        if (!personnel) {
            return res.status(400).json({ message: "Invalid refresh token." });
        }

        await Personnel.findByIdAndUpdate(personnel._id, { $unset: { refreshToken: "" } }, { new: true });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

export const authCheck = async (req, res) => {
    try {
        const personnelId = req.personnel.id;
        if(!personnelId)  return res.status(400).json({ message: "Invalid token." });
           
        const personnel = await Personnel.findById(personnelId).select('-password -refreshToken');
        if (!personnel) {
            return res.status(404).json({ message: "Personnel not found." });
        }

        res.status(200).json({ personnel });
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

export const refreshTokens = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required." });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
        const personnel = await Personnel.findOne({ _id: decoded.id, refreshToken });
        if (!personnel) {
            return res.status(401).json({ message: "Invalid refresh token." });
        }

       
        const newAccessToken = jwt.sign(
            { id: personnel._id, role: personnel.role },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const newRefreshToken = jwt.sign(
            { id: personnel._id },
            process.env.REFRESH_KEY,
            { expiresIn: '7d' } 
        );

    
        personnel.refreshToken = newRefreshToken;
        await personnel.save();

        
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token." + err.message });
    }
};
