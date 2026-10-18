import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <PageHeader title="This page got lost in the mail." lead="There's nothing at this address. Your postcards are safe." />
      <div className="flex flex-wrap gap-4">
        <LinkButton href="/" variant="primary">
          Back to Today
        </LinkButton>
        <LinkButton href="/wall" variant="secondary">
          Go to your wall
        </LinkButton>
      </div>
    </>
  );
}
