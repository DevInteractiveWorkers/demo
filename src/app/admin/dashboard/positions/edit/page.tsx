import EditPosition from "@/components/admin/data/edit-position";

export default async function EditPositionPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;

  return <EditPosition position={p} />;
}
