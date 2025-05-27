import {
  X,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Instagram,
} from "lucide-react";
import { useState } from "react";

const LaunchSuccessModal = ({ isOpen, onClose, portfolioUrl }) => {
  const [copied, setCopied] = useState(false);
  const [showInstagramTip, setShowInstagramTip] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`Check out my portfolio! ${portfolioUrl}`);
    setShowInstagramTip(true);
    setTimeout(() => setShowInstagramTip(false), 3000);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=Check out my portfolio!&url=${encodeURIComponent(
      portfolioUrl
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      portfolioUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      portfolioUrl
    )}`,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title and Message */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Portfolio Launched!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your portfolio is now live and ready to share with the world.
        </p>

        {/* Portfolio URL */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={portfolioUrl}
              readOnly
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Link2 size={20} />
            </button>
          </div>
          {copied && (
            <p className="text-green-500 text-sm mt-2">
              Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Share your portfolio
          </p>
          <div className="flex justify-center gap-4">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <Twitter size={24} />
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-[#4267B2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <Facebook size={24} />
            </a>
            <button
              onClick={handleInstagramShare}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            >
              <Instagram size={24} />
            </button>
          </div>
          {showInstagramTip && (
            <p className="text-green-500 text-sm text-center mt-2">
              Instagram text copied! Paste it in your Instagram story or post.
            </p>
          )}
        </div>

        {/* View Portfolio Button */}
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          View Portfolio
        </a>
      </div>
    </div>
  );
};

export default LaunchSuccessModal;
