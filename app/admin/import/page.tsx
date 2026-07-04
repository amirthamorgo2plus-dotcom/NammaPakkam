import ImportTool from '@/components/ImportTool';

export default function AdminImport() {
  return (
    <div className="space-y-3">
      <h2 className="font-bold">Bulk import businesses</h2>
      <p className="text-sm text-stone-500">
        Paste rows copied from WhatsApp / Excel. One business per line:
        <br /><code className="text-xs">Name, Category, Owner, Phone, Block, Description</code>
      </p>
      <ImportTool />
    </div>
  );
}
