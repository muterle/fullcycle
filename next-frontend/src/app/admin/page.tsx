"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "@/utils/socket.io";
import { RouteModel } from "@/utils/models";

export function AdminPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map) {
      return;
    }

    socket.on(
      `server:new-points:list`,
      async (data: { route_id: string; lat: number; lng: number }) => {
        const { route_id } = data;

        if (!map.hasRoute(route_id)) {
          const response = await fetch(`http://localhost:3005/api/routes/${route_id}`);
          const route = (await response.json()) as RouteModel;
          const leg = route.directions.routes[0].legs[0];

          map.addRouteWithIcons({
            routeId: route_id,
            startMarkerOptions: {
              position: leg.start_location,
            },
            endMarkerOptions: {
              position: leg.end_location,
            },
            carMarkerOptions: {
              position: leg.start_location,
            },
          });
        }
      }
    );
    return () => {
      socket.disconnect();
    };
  }, [map]);

  return <div className="h-full w-full" ref={mapContainerRef} />;
}

export default AdminPage;
