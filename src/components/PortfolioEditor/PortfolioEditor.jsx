"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { removeBackground } from "@imgly/background-removal";
import { Loader2 } from "lucide-react";
import Projects from "../common/[onboarding]/Projects";
import { useAuthContext } from "@/context/AuthContext";

// Browser-compatible UUID generation
const generateSecureId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const PortfolioEditor = ({ section, data, onClose, onSave }) => {
  const { user } = useAuthContext();
  const [formState, setFormState] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [creationProgress, setCreationProgress] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Initialize projects array if it doesn't exist
    if (
      section === "projects" &&
      (!data.projects || !Array.isArray(data.projects))
    ) {
      setFormState({
        ...data,
        projects: [
          {
            project_title: "",
            project_description: "",
            project_link: "",
            project_img: "",
          },
        ],
      });
    } else {
      setFormState(data);
    }
    setFieldErrors({});
  }, [data, section]);

  const handleChange = async (e) => {
    const { name, value: rawValue, files } = e.target;
    let value = rawValue;

    // Max length per field
    const maxLengths = {
      about_me: 1000,
      bio: 500, // Max length for bio
      phone: 15,
      email: 254,
      name: 60,
      home_title: 100,
      home_subtitle: 150,
      default: 240,
    };
    const fieldMaxLength = maxLengths[name] || maxLengths.default;
    let isValidInput = true;

    // Patterns to validate input
    const validationPatterns = {
      phone: /^[0-9+\s-]*$/, // Digits, spaces, +, and dashes
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Valid email
      about_me: /^(?!.*<[^>]*>)[a-zA-Z0-9\s.,'()!?\-]*$/, // No HTML, allow basic punctuation
      bio: /^(?!.*<[^>]*>)[a-zA-Z0-9\s.,'()!?\-]*$/, // Validation for bio
      name: /^[a-zA-Z\s]*$/, // Letters and spaces
      home_title: /^[a-zA-Z0-9\s.',!?-]*$/, // Basic sentence format
      home_subtitle: /^[a-zA-Z0-9\s.',!?-]*$/,
      github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-_/]+$/, // GitHub profile URLs
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.*$/, // LinkedIn URLs
      x: /^https?:\/\/(www\.)?(x|twitter)\.com\/.*$/, // Twitter/X URLs
      instagram: /^https?:\/\/(www\.)?instagram\.com\/.*$/, // Instagram URLs
      facebook: /^https?:\/\/(www\.)?facebook\.com\/.*$/, // Facebook URLs
    };

    // Handle image file
    if (name === "profileImage") {
      const file = files?.[0];
      if (!file) return;
      setSelectedFile(file);
      return;
    }

    // Auto-prepend https:// for social links if missing
    const socialFields = ["github", "linkedin", "x", "instagram", "facebook"];
    if (socialFields.includes(name)) {
      if (
        value &&
        !value.startsWith("http://") &&
        !value.startsWith("https://")
      ) {
        value = `https://${value}`;
      }
    }

    // Apply validation pattern if it exists
    if (validationPatterns[name]) {
      isValidInput = value === "" || validationPatterns[name].test(value);
    } else {
      // Default fallback pattern
      isValidInput = /^[a-zA-Z0-9\s.,!?'"()-]*$/.test(value);
    }

    const isTooLong = value.length > fieldMaxLength;

    // Update form state always
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update field error
    setFieldErrors((prev) => ({
      ...prev,
      [name]: !isValidInput || isTooLong,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    let updatedFormState = { ...formState };

    if (selectedFile) {
      try {
        setIsCreating(true);
        setCreationProgress("Processing your profile image...");

        if (!user) {
          console.error("User not logged in");
          return;
        }

        // First get the user's Supabase ID from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }

        if (!userData) {
          console.error("No user data found");
          return;
        }

        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${generateSecureId()}-${Date.now()}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        let processedBlob = null;

        try {
          processedBlob = await removeBackground(selectedFile, {
            debug: true,
            device: "cpu",
            model: "isnet_fp16",
            output: {
              format: "image/webp",
              quality: 0.8,
              type: "foreground",
            },
          });
        } catch (e) {
          console.warn("Background removal failed. Uploading original image.");
        }

        setCreationProgress("Uploading your profile image...");

        const uploadBlob = processedBlob || selectedFile;
        const contentType = processedBlob ? "image/webp" : selectedFile.type;

        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(filePath, uploadBlob, {
            contentType,
            cacheControl: "3600",
          });

        if (uploadError) {
          console.error("Upload failed:", uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath);

        if (!urlData?.publicUrl) {
          console.error("No public URL returned.");
          return;
        }

        updatedFormState = {
          ...updatedFormState,
          profileImage: urlData.publicUrl,
        };
      } catch (error) {
        console.error("Error processing profile image:", error);
      } finally {
        setIsCreating(false);
      }
    }

    // Call onSave with the section and the updated form state
    try {
      await onSave(section, updatedFormState);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    // Check if any field has an error
    const hasErrors = Object.values(fieldErrors).some(
      (error) => error === true
    );

    // Check if any required fields are empty
    const requiredFields = {
      about_me: "About Me",
      bio: "Bio", // Required field
      name: "Name",
      home_title: "Home Title",
      home_subtitle: "Home Subtitle",
    };

    const emptyRequiredFields = Object.entries(requiredFields).some(
      ([field, _]) => !formState[field] || formState[field].trim() === ""
    );

    return !hasErrors && !emptyRequiredFields;
  };

  const inputClass = (fieldName) =>
    `rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
      fieldErrors[fieldName]
        ? "border-red-500 focus:ring-2 focus:ring-red-400"
        : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <h2 className="text-xl font-semibold mb-2">Processing Image</h2>
            <p className="text-gray-600">{creationProgress}</p>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {section} Editor
        </h2>

        {section === "navbar" && (
          <>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className={inputClass("name")}
            />
          </>
        )}

        {section === "home" && (
          <>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <input
              name="home_title"
              value={formState.home_title || ""}
              onChange={handleChange}
              className={inputClass("home_title")}
            />

            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <input
              name="home_subtitle"
              value={formState.home_subtitle || ""}
              onChange={handleChange}
              className={inputClass("home_subtitle")}
            />

            <div className="flex flex-col justify-start items-start mb-4 ">
              <label className="block text-sm font-medium mb-1 ">
                Profile Image
              </label>

              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              <label
                htmlFor="profileImage"
                className="cursor-pointer rounded-lg px-4 py-2 w-full border text-gray-500 border-gray-300 group-hover:border-primary-500 group-hover:text-primary-500 transition-all duration-300 text-center break-all"
              >
                {selectedFile
                  ? selectedFile.name
                  : formState.profileImage || "Upload Profile Image"}
              </label>
            </div>
          </>
        )}

        {section === "projects" && (
          <div className="w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-white/80 rounded-xl  shadow-lg">
              <Projects formData={formState} setFormData={setFormState} />
            </div>
          </div>
        )}

        {section === "about" && (
          <>
            <label className="block text-sm font-medium mb-1">About Me</label>
            <textarea
              name="about_me"
              value={formState.about_me || ""}
              onChange={handleChange}
              className={`rounded-lg h-36 px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
                fieldErrors["about_me"]
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              }`}
            />

            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formState.bio || ""}
              onChange={handleChange}
              className={`rounded-lg h-24 px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
                fieldErrors["bio"]
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              }`}
            />
          </>
        )}

        {section === "contact" && (
          <>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={formState.phone || ""}
              onChange={handleChange}
              className={`rounded-lg px-4 py-2 w-full outline-none border transition-all duration-300 mb-4 ${
                fieldErrors["phone"]
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              }`}
            />

            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={formState.email || ""}
              onChange={handleChange}
              className={inputClass("email")}
            />

            <label className="block text-sm font-medium mb-1">Github</label>
            <input
              name="github"
              value={formState.github || ""}
              onChange={handleChange}
              className={inputClass("github")}
            />
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              name="linkedin"
              value={formState.linkedin || ""}
              onChange={handleChange}
              className={inputClass("linkedin")}
            />
            <label className="block text-sm font-medium mb-1">X</label>
            <input
              name="x"
              value={formState.x || ""}
              onChange={handleChange}
              className={inputClass("x")}
            />
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              name="instagram"
              value={formState.instagram || ""}
              onChange={handleChange}
              className={inputClass("instagram")}
            />
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <input
              name="facebook"
              value={formState.facebook || ""}
              onChange={handleChange}
              className={inputClass("facebook")}
            />
          </>
        )}

        {section === "footer" && (
          <>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={formState.name || ""}
              onChange={handleChange}
              className={inputClass("name")}
            />
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              isFormValid()
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isFormValid() || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;
