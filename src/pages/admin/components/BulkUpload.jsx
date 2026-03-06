import React, { useState } from 'react';
import { productApi } from '../../../api';
import * as XLSX from 'xlsx';

const BulkUpload = ({ onComplete }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleBulkUpload = async (productsArray) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const products = productsArray || JSON.parse(jsonInput);
            if (!Array.isArray(products)) {
                throw new Error("Input must be an array of product objects.");
            }

            // Cleanup/Validate objects
            const cleanedProducts = products.map(p => ({
                title: p.title || '',
                slug: p.slug || '',
                description: p.description || '',
                category: p.category || 'Necklace',
                price: Number(p.price) || 0,
                stockQuantity: Number(p.stockQuantity) || 0,
                images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
                sku: p.sku || '',
                active: p.active !== undefined ? p.active : true
            }));

            const res = await productApi.bulkCreateProducts(cleanedProducts);
            if (res.success) {
                setSuccess(`Successfully uploaded ${res.count} products.`);
                setJsonInput('');
                if (onComplete) onComplete();
            } else {
                setError(res.message || "Bulk upload failed.");
            }
        } catch (err) {
            setError(err.message || "Upload failed. Please check your format.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Convert comma separated images string to array if present
                const formattedData = data.map(item => ({
                    ...item,
                    images: typeof item.images === 'string' ? item.images.split(',').map(s => s.trim()) : item.images
                }));

                handleBulkUpload(formattedData);
            } catch (err) {
                setError("Failed to parse Excel file. Ensure it is a valid .xlsx or .csv");
            }
        };
        reader.readAsBinaryString(file);
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                title: "Example Product",
                description: "Detailed description here",
                category: "Necklace",
                price: 999,
                stockQuantity: 100,
                sku: "PROD001",
                images: "https://link1.com, https://link2.com",
                slug: "example-product"
            }
        ];
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "StringTheory_Bulk_Template.xlsx");
    };

    return (
        <div className="bulk-upload-container">
            <div className="bulk-upload-header">
                <h3>Bulk Product Upload</h3>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={downloadTemplate}>Download XLSX Template</button>
                </div>
            </div>

            <div className="upload-methods">
                <div className="method-box">
                    <h4>Option 1: Upload Excel/CSV</h4>
                    <p className="help-text">Download our template, fill it, and upload here.</p>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="excel-upload"
                    />
                    <label htmlFor="excel-upload" className="btn-bulk-upload" style={{ display: 'inline-block', textAlign: 'center' }}>
                        {loading ? 'Processing...' : 'Choose Excel File'}
                    </label>
                </div>

                <div className="method-divider"><span>OR</span></div>

                <div className="method-box">
                    <h4>Option 2: Paste JSON</h4>
                    <p className="help-text">Paste a JSON array directly.</p>
                    <textarea
                        className="bulk-textarea"
                        rows="8"
                        placeholder='[{"title": "Product 1", ...}]'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                    />
                    <button
                        className="btn-bulk-upload"
                        onClick={() => handleBulkUpload()}
                        disabled={loading || !jsonInput.trim()}
                    >
                        {loading ? 'Uploading...' : 'Process JSON'}
                    </button>
                </div>
            </div>

            {error && <div className="bulk-error">{error}</div>}
            {success && <div className="bulk-success">{success}</div>}
        </div>
    );
};

export default BulkUpload;
