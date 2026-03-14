'use client';

import {
  SliceSimulator,
  type SliceSimulatorSliceZoneProps,
} from '@slicemachine/adapter-next/simulator';

const SliceZone = ({ slices }: SliceSimulatorSliceZoneProps) => {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <h1 className="mb-4 text-xl font-semibold">Prismic Slice Simulator</h1>
      <p className="mb-6 text-sm text-slate-300">
        Waiting for Slice Machine state. Once you open a slice in Slice Machine, preview data will
        render here.
      </p>
      <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs leading-relaxed text-slate-200">
        {JSON.stringify(slices, null, 2)}
      </pre>
    </main>
  );
};

export default function SliceSimulatorPage() {
  return <SliceSimulator sliceZone={SliceZone} />;
}
