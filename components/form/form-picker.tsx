"use client";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";
import Link from "next/link";
import { FormErrors } from "./form-error";

interface UnsplashImage {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
}

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
  onImageSelect: (id: string) => void;
}

export const FormPicker = ({ id, errors, onImageSelect }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<UnsplashImage[]>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (result?.response) {
          setImages(result.response as UnsplashImage[]);
        } else {
          console.error("Failed to load images");
        }
      } catch (error) {
        console.error(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image: UnsplashImage) => {
    if (pending) return;
    const imgId = `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`;
    setSelectedImageId(imgId);
    onImageSelect(imgId);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => handleImageClick(image)}
          >
            <input
              type="radio"
              id={id}
              name="image"
              className="hidden"
              checked={selectedImageId === `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              onChange={() => {}}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
              fill
            />
            {selectedImageId === `${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}` && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
