import { Layout } from "../components/Layout";
import { OperationsConsole } from "../components/OperationsConsole";
import { SeoHead } from "../components/SeoHead";

export default function OperationsPage() {
  return (
    <Layout>
      <SeoHead
        title="Operations"
        description="Run local automation jobs for collection, optimization, publishing, and rollback."
        path="/operations"
        robots="noindex,nofollow"
      />
      <section className="listing-page operations-page">
        <h1>Automation Operations</h1>
        <p>Local controls for the evidence-led optimization workflow.</p>
        <OperationsConsole />
      </section>
    </Layout>
  );
}
