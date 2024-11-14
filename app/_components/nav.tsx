import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="w-full flex flex-row justify-between py-4 px-10 bg-slate-200">
      <div>
        <Link href={"/"}>David Testers</Link>
      </div>
      <div className="flex flex-row gap-2">
        <Link href={"/calendar"} className="font-semibold text-blue-600">Calendar</Link>
      </div>
    </nav>
  );
}
