import { Helmet } from "react-helmet-async";
import { buildRouteSchemas, type RouteFaq } from "@/data/route-parity";

export function RouteSchemas({ route, faqs }: { route: string; faqs?: RouteFaq[] }) {
  return (
    <Helmet>
      {buildRouteSchemas(route, faqs).map((schema) => (
        <script key={String(schema["@id"] ?? schema["@type"])} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
