import { BiLoaderAlt } from "react-icons/bi";
import { TypographyH1, TypographyP } from "./Typography";
import { cn } from "../lib/extra";

type YtPreviewProps = {
  thumbnailSrc: string;
  title: string;
  description: string;
  isYtThumbnailLoading: boolean;
  isYtDataLoading: boolean;
  isDisplaying: boolean;
};

export default function YtPreview(props: YtPreviewProps) {
  const {
    title,
    description,
    thumbnailSrc,
    isYtThumbnailLoading,
    isYtDataLoading,
    isDisplaying,
  } = props;
  return (
    <>
      <div
        className={cn(
          !isDisplaying ? "hidden" : "",
          "my-4 mx-auto p-2 grid grid-cols-[auto_1fr] gap-4 items-center justify-items-start bg-white max-w-[600px] w-[92%] rounded-lg"
        )}
      >
        <div>
          <img
            src={thumbnailSrc}
            className={cn(
              isYtThumbnailLoading ? "hidden" : "",
              "h-[96px] rounded-lg"
            )}
          />
          <BiLoaderAlt
            size={24}
            className={cn(
              !isYtThumbnailLoading ? "hidden" : "",
              "animate-spin"
            )}
          />
        </div>
        <div>
          <TypographyH1
            className={cn(
              isYtDataLoading ? "hidden" : "",
              "text-md lg:text-md line-clamp-1 font-semibold"
            )}
          >
            {title}
          </TypographyH1>
          <TypographyP
            className={cn(isYtDataLoading ? "hidden" : "", "line-clamp-1")}
          >
            {description}
          </TypographyP>
          <TypographyP
            className={cn(!isYtDataLoading ? "hidden" : "", "line-clamp-1")}
          >
            Loading...
          </TypographyP>
        </div>
      </div>
    </>
  );
}
