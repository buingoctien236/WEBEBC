// components/ImageUpload.tsx
import { useState, useRef } from 'react';
import { Upload, X, Copy, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    fileName: string;
    size: number;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Kiểm tra kích thước (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File ảnh không được vượt quá 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://ebc-biotech.com/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload thất bại');
      }

      setUploadResult(data);
      if (onUploadComplete && data.url) {
        onUploadComplete(data.url);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi upload');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadResult?.url) {
      navigator.clipboard.writeText(uploadResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Upload Ảnh Sản Phẩm
        </h2>
        <p className="text-gray-600">Upload ảnh lên Cloudinary và nhận link</p>
      </div>

      {/* File Selection */}
      <div className="mb-6">
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-green-600 mb-3" />
              <p className="font-medium text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="mt-3 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Xóa file
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Kéo thả ảnh vào đây hoặc click để chọn</p>
              <p className="text-sm text-gray-500 mt-2">Hỗ trợ JPG, PNG, GIF, WebP (tối đa 5MB)</p>
            </>
          )}
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="mb-6">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all
            ${!selectedFile || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang upload...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload Ảnh</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium flex items-center gap-2">
            <X className="w-5 h-5" />
            {error}
          </p>
        </div>
      )}

      {/* Result Output */}
      {uploadResult && (
        <div className="border border-green-200 rounded-xl bg-green-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">Upload thành công!</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Link ảnh:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={uploadResult.url}
                  readOnly
                  className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-gray-800 font-mono text-sm truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã copy</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-500">File name</p>
                <p className="font-medium truncate">{uploadResult.fileName}</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-sm text-gray-500">Size</p>
                <p className="font-medium">{formatFileSize(uploadResult.size)}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Ảnh đã upload:</p>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={uploadResult.url}
                  alt="Uploaded"
                  className="w-full h-48 object-contain bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">Cách sử dụng:</h4>
        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
          <li>Chọn file ảnh từ máy tính</li>
          <li>Nhấn "Upload Ảnh" để tải lên Cloudinary</li>
          <li>Sao chép link ảnh từ kết quả</li>
          <li>Sử dụng link trong database hoặc hiển thị sản phẩm</li>
        </ol>
      </div>
    </div>
  );
}