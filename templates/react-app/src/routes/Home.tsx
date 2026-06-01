import { Button, Badge, Input, Card } from "@bernardoestrada/design-system";

export function Home() {
  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">primary</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="error">error</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="info">info</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Input</h2>
        <Input label="Email" placeholder="you@example.com" type="email" />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Card</h2>
        <Card
          title="Example Card"
          actions={<Button size="sm">Action</Button>}
        >
          A sample card from the design system. Delete this page and start
          building once the design system is wired up correctly.
        </Card>
      </section>
    </div>
  );
}
