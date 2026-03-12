import Link from 'next/link';

type RichTextNode = { text?: string };

type HeroBannerPrimary = {
    headline?: RichTextNode[];
    description?: RichTextNode[];
    primary_button_label?: string;
    primary_button_link?: { url?: string | null };
    secondary_button_label?: string;
    secondary_button_link?: { url?: string | null };
};

type HeroBannerSlice = {
    slice_type: string;
    variation: string;
    primary?: HeroBannerPrimary;
};

type HeroBannerProps = {
    slice: HeroBannerSlice;
};

const toPlainText = (value?: RichTextNode[]) => value?.map((node) => node.text ?? '').join(' ').trim() ?? '';

const HeroBanner = ({ slice }: HeroBannerProps) => {
    const primary = slice.primary ?? {};

    const headline = toPlainText(primary.headline);
    const description = toPlainText(primary.description);

    const primaryLabel = primary.primary_button_label?.trim() ?? '';
    const primaryLink = primary.primary_button_link?.url ?? '';

    const secondaryLabel = primary.secondary_button_label?.trim() ?? '';
    const secondaryLink = primary.secondary_button_link?.url ?? '';

    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
            {headline ? <h1>{headline}</h1> : null}
            {description ? <p>{description}</p> : null}

            <div>
                {primaryLabel && primaryLink ? <Link href={primaryLink}>{primaryLabel}</Link> : null}
                {secondaryLabel && secondaryLink ? <Link href={secondaryLink}>{secondaryLabel}</Link> : null}
            </div>
        </section>
    );
};

export default HeroBanner;