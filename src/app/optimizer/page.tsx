"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface SolverEntry {
  module: string;
  lessonType: string;
  classNumber: string;
  timeslots: [number, number, number][];
}

interface BlockData {
  module: string;
  label: string;
  gridColStart: number;
  gridColSpan: number;
  gridRowStart: number;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 12 }, (_, i) => 8 + i);

const COLORS = [
  "bg-red-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-fuchsia-400",
] as const;

const colourOf = (key: string) => COLORS[Array.from(key).reduce((h, c) => (h * 31 + c.charCodeAt(0)) % COLORS.length, 0)];

const shortType = (t: string) => {
  const s = t.toLowerCase();
  if (s.startsWith("lec")) return "Lec";
  if (s.startsWith("lab")) return "Lab";
  if (s.startsWith("tutorial") || s.startsWith("tut")) return "Tut";
  if (s.startsWith("rec")) return "Rec";
  return t.slice(0, 3);
};

const toBlocks = (data: SolverEntry[]): BlockData[] => {
  const blocks: BlockData[] = [];

  data.forEach(({ module, lessonType, classNumber, timeslots }) => {
    const label = `${shortType(lessonType)}/${classNumber}`;
    const grouped: Record<number, number[]> = {};

    timeslots.forEach(([, dayIdx, hourIdx]) => {
      const hour = hourIdx + 8;
      (grouped[dayIdx] ??= []).push(hour);
    });

    Object.entries(grouped).forEach(([day, hours]) => {
      const sorted = [...new Set(hours)].sort((a, b) => a - b);
      let start = sorted[0], prev = sorted[0];

      for (let i = 1; i <= sorted.length; i++) {
        if (i === sorted.length || sorted[i] !== prev + 1) {
          blocks.push({
            module,
            label,
            gridColStart: start - 8 + 2,
            gridColSpan: prev - start + 1,
            gridRowStart: Number(day) + 2,
          });
          start = sorted[i];
        }
        prev = sorted[i];
      }
    });
  });

  return blocks;
};

const Block = ({ data, color }: { data: BlockData; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    className={`${color} border border-gray-600 rounded-lg shadow-sm flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 text-[0.65rem] sm:text-xs leading-tight overflow-hidden`}
    style={{
      gridColumnStart: data.gridColStart,
      gridColumnEnd: `span ${data.gridColSpan}`,
      gridRowStart: data.gridRowStart,
      gridRowEnd: data.gridRowStart + 1,
    }}
  >
    <span className="font-bold">{data.module}</span>
    <span>{data.label}</span>
  </motion.div>
);

const Timetable = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/modules/optimizer`, {
        withCredentials: true
      });
        const blockData = toBlocks(res.data);
        blockData.length ? setBlocks(blockData) : setError("Optimizer returned no classes.");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    blocks.forEach((b) => (map[b.module] ??= colourOf(b.module)));
    return map;
  }, [blocks]);

  return (
    <Card className="w-full overflow-x-auto border-none bg-white/80 backdrop-blur-lg shadow-xl">
      <CardContent className="relative p-4 sm:p-6">
        <div
          className="grid text-gray-800"
          style={{
            gridTemplateColumns: `90px repeat(${HOURS.length}, 1fr)`,
            gridTemplateRows: `52px repeat(${DAYS.length}, 100px)`,
          }}
        >
          <div className="border-b border-r border-gray-500" />
          {HOURS.map((h, i) => (
            <div
              key={h}
              className="flex items-center justify-center font-semibold border-b border-gray-500 text-xs sm:text-sm"
              style={{ gridColumnStart: i + 2, gridRowStart: 1 }}
            >
              {h}-{h + 1}
            </div>
          ))}
          {DAYS.map((d, i) => (
            <div
              key={d}
              className="flex items-center justify-center font-semibold border-r border-gray-500 text-xs sm:text-sm"
              style={{ gridColumnStart: 1, gridRowStart: i + 2 }}
            >
              {d}
            </div>
          ))}
          {Array.from({ length: DAYS.length * HOURS.length }).map((_, idx) => {
            const row = Math.floor(idx / HOURS.length) + 2;
            const col = (idx % HOURS.length) + 2;
            return <div key={idx} className="border-b border-l border-gray-200" style={{ gridColumnStart: col, gridRowStart: row }} />;
          })}
          {blocks.map((b, i) => <Block key={i} data={b} color={colorMap[b.module]} />)}
        </div>

        {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/60"><span className="animate-pulse text-sm font-medium">Loading…</span></div>}
        {error && <div className="absolute inset-0 flex items-center justify-center bg-red-50"><span className="text-red-600 text-sm text-center px-2 max-w-xs">{error}</span></div>}
      </CardContent>
    </Card>
  );
};

export default Timetable;
