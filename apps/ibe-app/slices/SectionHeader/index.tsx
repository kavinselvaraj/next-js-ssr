type RichTextNode = { text?: string };

type SectionHeaderPrimary = {
  title?: string;
  subtitle?: RichTextNode[];
};

type SectionHeaderSlice = {
  slice_type: string;
  variation: string;
  primary?: SectionHeaderPrimary;
};

type SectionHeaderProps = {
  slice: SectionHeaderSlice;
};

const toPlainText = (value?: RichTextNode[]) =>
  value
    ?.map((node) => node.text ?? '')
    .join(' ')
    .trim() ?? '';

const SectionHeader = ({ slice }: SectionHeaderProps) => {
  const primary = slice.primary ?? {};
  const title = primary.title?.trim() ?? '';
  const subtitle = toPlainText(primary.subtitle);

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {title ? <h2>{title}</h2> : null}
      {subtitle ? <p>{subtitle}</p> : null}
    </section>
  );
};

export default SectionHeader;
