import Property from "../../models/Property/Property.js";
import calculateDepreciation from "../../utils/calculateDepreciation.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getPropertiesWithDepreciation = async (req, res) => {
  try {
    /* Query params */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    /* Fetch properties */
    const properties = await Property.find()
      .populate("item", "itemName")
      .populate("acquisitionType", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    /* Search filtering */
    const filtered = properties.filter((prop) => {
      const itemName = prop.item?.itemName?.toLowerCase() || "";
      const propertyNo = prop.propertyNo?.toLowerCase() || "";

      return (
        itemName.includes(search.toLowerCase()) ||
        propertyNo.includes(search.toLowerCase())
      );
    });

    /* Depreciation mapping */
    const result = filtered.map((prop) => {
      const acquisitionValue = prop.acquisitionValue;
      const acquisitionDate = prop.acquisitionDate;

      const currentValue = calculateDepreciation(
        acquisitionValue,
        acquisitionDate
      );

      const depreciated = acquisitionValue - currentValue;

      const now = new Date();
      const purchase = new Date(acquisitionDate);

      const yearsPassed =
        (now - purchase) / (1000 * 60 * 60 * 24 * 365);

      const remainingLife = Math.max(5 - yearsPassed, 0);

      return {
        propertyNo: prop.propertyNo,
        itemName: prop.item?.itemName || null,
        acquisitionDate: prop.acquisitionDate,
        acquisitionName: prop.acquisitionType?.name || null,
        acquisitionValue,

        currentValue,
        depreciated: Math.round(depreciated),
        remainingLife: Math.ceil(remainingLife),
      };
    });

    const total = await Property.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchAllPropertiesWithDepreciation = async (search = "") => {
  const properties = await Property.find()
    .populate("item", "itemName")
    .populate("acquisitionType", "name")
    .sort({ createdAt: -1 });

  const filtered = properties.filter((prop) => {
    const itemName = prop.item?.itemName?.toLowerCase() || "";
    const propertyNo = prop.propertyNo?.toLowerCase() || "";
    return (
      itemName.includes(search.toLowerCase()) ||
      propertyNo.includes(search.toLowerCase())
    );
  });

  return filtered.map((prop) => {
    const acquisitionValue = prop.acquisitionValue;
    const acquisitionDate = prop.acquisitionDate;

    const currentValue = calculateDepreciation(acquisitionValue, acquisitionDate);
    const depreciated = acquisitionValue - currentValue;

    const now = new Date();
    const purchase = new Date(acquisitionDate);
    const yearsPassed = (now - purchase) / (1000 * 60 * 60 * 24 * 365);
    const remainingLife = Math.max(5 - yearsPassed, 0);

    return {
      propertyNo: prop.propertyNo,
      itemName: prop.item?.itemName || "N/A",
      acquisitionDate: acquisitionDate
        ? new Date(acquisitionDate).toLocaleDateString("en-US")
        : "N/A",
      acquisitionName: prop.acquisitionType?.name || "N/A",
      acquisitionValue,
      currentValue: Math.round(currentValue),
      depreciated: Math.round(depreciated),
      remainingLife: Math.ceil(remainingLife),
    };
  });
};

/* ─── CSV Download ───────────────────────────────────────────────── */

export const downloadPropertiesCSV = async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await fetchAllPropertiesWithDepreciation(search);

    const fields = [
      { label: "Property No.", value: "propertyNo" },
      { label: "Item Name", value: "itemName" },
      { label: "Acquisition Date", value: "acquisitionDate" },
      // { label: "Acquisition Type",   value: "acquisitionName" },
      { label: "Acquisition Value", value: "acquisitionValue" },
      { label: "Current Value", value: "currentValue" },
      { label: "Depreciated Amount", value: "depreciated" },
      { label: "Remaining Life (yrs)", value: "remainingLife" },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="properties_depreciation_${Date.now()}.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ message: "Failed to generate CSV" });
  }
};

/* ─── PDF Download ───────────────────────────────────────────────── */


export const downloadPropertiesPDF = async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await fetchAllPropertiesWithDepreciation(search);

    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="properties_depreciation_${Date.now()}.pdf"`
    );
    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    /* ── Table config (defined first so everything can reference it) ── */
    const columns = [
      { label: "Property No.", key: "propertyNo", width: 90 },
      { label: "Item Name", key: "itemName", width: 110 },
      { label: "Acq. Date", key: "acquisitionDate", width: 75 },
      { label: "Acq. Value", key: "acquisitionValue", width: 80 },
      { label: "Current Value", key: "currentValue", width: 80 },
      { label: "Depreciated", key: "depreciated", width: 80 },
      { label: "Remaining Life (yrs)", key: "remainingLife", width: 80 },
    ];

    const totalTableWidth = columns.reduce((s, c) => s + c.width, 0);
    const startX = doc.page.margins.left + (pageWidth - totalTableWidth) / 2;

    /* ── Logos + Title ── */
    /* ── Logos + Title ── */
    const logoWidth = 40;
    const logoHeight = 40;
    const leftLogoPath = path.join(__dirname, "../../assets/bagongpinas.png");
    const rightLogoPath = path.join(__dirname, "../../assets/logos.png");

    const topY = doc.y;

    // Title block starts right after left logo + 6px gap
    const titleX = startX + logoWidth + 6;
    // Title block ends right before right logo - 6px gap
    const titleWidth = totalTableWidth - logoWidth * 2 - 12;

    // Left logo
    doc.image(leftLogoPath, startX, topY, { width: logoWidth, height: logoHeight });

    // Right logo
    doc.image(rightLogoPath, startX + totalTableWidth - logoWidth, topY, { width: logoWidth, height: logoHeight });

    // Title fits exactly between the two logos
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#1E293B")
      .text("Property Depreciation Report", titleX, topY + 6, {
        width: titleWidth,
        align: "center",
      });

    doc.fontSize(9).font("Helvetica").fillColor("#64748B")
      .text(`Generated: ${new Date().toLocaleString("en-US")}`, titleX, topY + 26, {
        width: titleWidth,
        align: "center",
      });

    doc.y = topY + logoHeight + 6;

    /* ── Summary Stats ── */
    const totalAcquisition = data.reduce((s, r) => s + Number(r.acquisitionValue || 0), 0);
    const totalCurrent = data.reduce((s, r) => s + Number(r.currentValue || 0), 0);
    const totalDepreciated = data.reduce((s, r) => s + Number(r.depreciated || 0), 0);

    const stats = [
      { label: "Total Properties", value: String(data.length) },
      { label: "Acquisition Value", value: `PHP ${totalAcquisition.toLocaleString("en-PH")}` },
      { label: "Current Value", value: `PHP ${totalCurrent.toLocaleString("en-PH")}` },
      { label: "Total Depreciated", value: `PHP ${totalDepreciated.toLocaleString("en-PH")}` },
    ];

    const statGap = 8;
    const statBoxWidth = (totalTableWidth - (stats.length - 1) * statGap) / stats.length;
    const statBoxHeight = 40;
    const statsY = doc.y;

    stats.forEach((stat, i) => {
      const bx = startX + i * (statBoxWidth + statGap);
      doc.roundedRect(bx, statsY, statBoxWidth, statBoxHeight, 4).fill("#EFF6FF");
      doc.font("Helvetica").fontSize(7).fillColor("#6B7280")
        .text(stat.label, bx + 10, statsY + 8, { width: statBoxWidth - 20 });
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#1E40AF")
        .text(stat.value, bx + 10, statsY + 20, { width: statBoxWidth - 20 });
    });

    doc.y = statsY + statBoxHeight + 12;

    /* ── Table Header ── */
    const tableTop = doc.y;
    const headerHeight = 27;
    const rowHeight = 22;
    const headerFillColor = "#2563EB";
    const evenRowColor = "#F1F5F9";
    const textColor = "#1E293B";

    let x = startX;
    doc.rect(startX, tableTop, totalTableWidth, headerHeight).fill(headerFillColor);

    columns.forEach((col) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor("#FFFFFF")
        .text(col.label, x + 8, tableTop + 9, { width: col.width - 16, align: "left" });
      x += col.width;
    });

    /* ── Table Rows ── */
    let y = tableTop + headerHeight;

    data.forEach((row, i) => {
      if (i % 2 === 0) {
        doc.rect(startX, y, totalTableWidth, rowHeight).fill(evenRowColor);
      }

      x = startX;
      columns.forEach((col) => {
        let value = row[col.key];
        if (["acquisitionValue", "currentValue", "depreciated"].includes(col.key)) {
          value = `PHP ${Number(value).toLocaleString("en-PH")}`;
        }
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(textColor)
          .text(String(value ?? "N/A"), x + 8, y + 7, {
            width: col.width - 16,
            align: "left",
            ellipsis: true,
          });
        x += col.width;
      });

      doc.rect(startX, y, totalTableWidth, rowHeight).stroke("#CBD5E1");
      y += rowHeight;

      if (y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.page.margins.top;
      }
    });

    /* ── Footer ── */
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#94A3B8")
      .text(`Total records: ${data.length}`, startX, y + 10);

    doc.end();
  } catch (error) {
    console.error("PDF export error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};