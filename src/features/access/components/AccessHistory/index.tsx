import { useAccessLogs } from "@/features/access/hooks/useAccessLogs";
import { AccessList } from "../AccessList";
import { History } from "@mui/icons-material";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export const AccessHistory = () => {
  const { data: accesses, isLoading } = useAccessLogs();

  if (isLoading) {
    return <LoadingScreen fullScreen={false} message="Cargando registros de acceso..." />;
  }

  return (
    <AccessList 
      accesses={accesses || []} 
      emptyState={
        <EmptyState
          icon={<History sx={{ fontSize: 40, color: "text.secondary" }} />}
          title="Sin registros de acceso"
          description="No hay registros de acceso para mostrar"
        />
      }
    />
  );
};
