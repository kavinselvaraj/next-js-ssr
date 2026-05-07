import Link from 'next/link';
import Image from 'next/image';

type RichTextNode = { text?: string };

type ImageCardPrimary = {
  image?: {
    url?: string | null;
    alt?: string | null;
    dimensions?: { width: number; height: number } | null;
  };
  image_title?: string | null;
  description?: RichTextNode[];
  link?: { url?: string | null };
  link_label?: string | null;
};

type ImageCardSlice = {
  slice_type: string;
  variation: string;
  primary?: ImageCardPrimary;
};

type ImageCardProps = {
  slice: ImageCardSlice;
};

const toPlainText = (value?: RichTextNode[]) =>
  value
    ?.map((node) => node.text ?? '')
    .join(' ')
    .trim() ?? '';

const ImageCard = ({ slice }: ImageCardProps) => {
  const primary = slice.primary ?? {};

  const imageUrl = primary.image?.url ?? null;
  const imageAlt = primary.image?.alt ?? '';
  const imageWidth = primary.image?.dimensions?.width ?? 800;
  const imageHeight = primary.image?.dimensions?.height ?? 600;

  const title = primary.image_title?.trim() ?? '';
  const description = toPlainText(primary.description);

  const linkUrl = primary.link?.url ?? null;
  const linkLabel = primary.link_label?.trim() ?? '';

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      {imageUrl ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="p-4">
        {title ? <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3> : null}
        {description ? <p className="mb-3 text-sm text-gray-600">{description}</p> : null}
        {linkUrl && linkLabel ? (
          <Link
            href={linkUrl}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
};

export default ImageCard;
