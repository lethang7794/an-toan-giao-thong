export default function BlankLayout({
  children,
}: { children: React.ReactNode }) {
  return <div className="h-full flex flex-col">{children}</div>
}
