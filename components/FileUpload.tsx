
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-lg text-center p-8 animate-slide-up">
      <h2 className="text-2xl font-bold text-brand-light mb-4">Get Instant Feedback on Your Mix</h2>
      <p className="text-slate-400 mb-8">Upload your track (.wav, .mp3, .aiff) to see if it meets professional radio standards.</p>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 transition-colors duration-300 ${isDragging ? 'border-brand-blue bg-brand-dark/30' : 'border-slate-light/50 bg-slate-mid/30'}`}
      >
        <input
          type="file"
          id="audio-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept="audio/wav, audio/mpeg, audio/aiff"
        />
        <label htmlFor="audio-upload" className="flex flex-col items-center justify-center cursor-pointer">
          <svg className="w-16 h-16 mb-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-lg font-semibold text-white">
            <span className="text-brand-blue">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-slate-400 mt-1">WAV, MP3, or AIFF files</p>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
