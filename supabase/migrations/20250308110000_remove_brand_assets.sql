/*
  # Remove Brand Assets
  
  Removes the 'Brands' section assets from the site_assets table since the Brand Mall
  component has been removed from the application.

  ## Metadata:
  - Schema-Category: "Data"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (by re-running previous migration)
*/

DELETE FROM site_assets WHERE section = 'Brands';
