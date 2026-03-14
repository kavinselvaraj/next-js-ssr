type FeaturedFlightsPrimary = {
  section_title?: string;
  max_items?: number;
};

type FeaturedFlightsSlice = {
  slice_type: string;
  variation: string;
  primary?: FeaturedFlightsPrimary;
};

type FeaturedFlightsProps = {
  slice: FeaturedFlightsSlice;
};

const FeaturedFlights = ({ slice }: FeaturedFlightsProps) => {
  const primary = slice.primary ?? {};
  const title = primary.section_title?.trim() ?? '';
  const maxItems = typeof primary.max_items === 'number' ? primary.max_items : undefined;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {title ? <h2>{title}</h2> : null}
      <p>Configuration only slice. Max items: {maxItems ?? 'not set'}.</p>
    </section>
  );
};

export default FeaturedFlights;
