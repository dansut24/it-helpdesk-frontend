import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";

const SearchResults = ({ query, results, openTab, previousTab }) => {
  const hasResults = Object.values(results).some((list) => list.length > 0);

  return (
    <Box sx={{ p: 3 }}>
      {previousTab && (
        <Button
          onClick={() => openTab(previousTab)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          ← Back to {previousTab}
        </Button>
      )}

      <Typography variant="h5" sx={{ mb: 2 }}>
        Search Results for "{query}"
      </Typography>

      {!hasResults && (
        <Typography variant="body1">No results found.</Typography>
      )}

      {Object.entries(results).map(([section, items]) => (
        items.length > 0 && (
          <Box key={section} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Typography>
            <List>
              {items.map((item) => {
                const tabLabel =
                  section === "incidents"
                    ? `Incident ${item.referenceNumber}`
                    : section === "requests"
                    ? `Service Request ${item.id}`
                    : section === "changes"
                    ? `Change ${item.id}`
                    : `KB ${item.id}`;

                return (
                  <ListItem
                    key={item.id}
                    button
                    onClick={() => openTab(tabLabel)}
                  >
                    <ListItemText
                      primary={
                        item.title || item.referenceNumber || `Item ${item.id}`
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )
      ))}
    </Box>
  );
};

export default SearchResults;
