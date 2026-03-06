import React, { useState } from 'react';
import { storage } from '../../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ImageUpload = ({ onUploadSuccess, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }

        setUploading(true);
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(prog);
            },
            (error) => {
                console.error("Upload failed", error);
                setUploading(false);
                alert("Upload failed. Check console.");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUploading(false);
                    onUploadSuccess(downloadURL);
                });
            }
        );
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className="image-upload-wrapper">
            <div
                className={`image-upload-dropzone ${dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {uploading ? (
                    <div className="upload-progress-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                        <span>Uploading {progress}%</span>
                    </div>
                ) : (
                    <div className="upload-content">
                        {currentImage ? (
                            <div className="image-preview">
                                <img src={currentImage} alt="Preview" />
                                <div className="overlay">Change Image</div>
                            </div>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="upload-icon">+</i>
                                <p>Drag & Drop or Click to Upload</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="file-input"
                            onChange={handleChange}
                            accept="image/*"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
