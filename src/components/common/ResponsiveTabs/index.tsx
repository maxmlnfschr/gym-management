import { Tabs, Tab, useTheme, useMediaQuery } from "@mui/material";

interface ResponsiveTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabs: {
    label: string;
    count?: number;
  }[];
}

export const ResponsiveTabs = ({
  value,
  onChange,
  tabs,
}: ResponsiveTabsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Tabs
      value={value}
      onChange={onChange}
      variant={isMobile ? "fullWidth" : "standard"}
      sx={{
        minHeight: { xs: "36px", sm: "48px" },
        "& .MuiTab-root": {
          minHeight: { xs: "36px", sm: "48px" },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          padding: { xs: "6px 8px", sm: "12px 16px" },
          minWidth: { xs: "auto", sm: "120px" },
        },
        "& .Mui-selected": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          fontWeight: 500,
          // borderRadius: 1
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={`${tab.label} ${tab.count ? `(${tab.count})` : ""}`}
          sx={{
            textTransform: "none",
            flex: { xs: 1, sm: "none" },
          }}
        />
      ))}
    </Tabs>
  );
};
