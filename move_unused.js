const fs = require('fs');
const path = require('path');

const unusedFiles = [
  'check_columns_events.js',
  'check_columns.js',
  'check_programs.js',
  'check_schema.js',
  'create_admin_user.js',
  'create_grasag_bucket.js',
  'scratch/check-congress.js',
  'scratch/fetch-news.js',
  'scratch/inspect-news.js',
  'scripts/fix_use_client.js',
  'scripts/runMigration.ts',
  'scripts/seed_page_contents.js',
  'scripts/seed_page_contents.ts',
  'scripts/test-delete.js',
  'scripts/test-patch.js',
  'src/app/admin/globals.css',
  'src/app/admin/Header.tsx',
  'src/app/admin/leadership/test.tsx',
  'src/app/admin/ThemeProvider.tsx',
  'src/app/news-updates/[id]/ShareButton.tsx',
  'src/components/admin/AdminFormField.tsx',
  'src/components/admin/AdminSidebar.tsx',
  'src/components/admin/NewsForm.tsx',
  'src/components/admin/SubEventModal.tsx',
  'src/components/admin/ui/AdminPageTemplate.tsx',
  'src/components/admin/ui/Button.tsx',
  'src/components/admin/ui/Card.tsx',
  'src/components/admin/ui/Header.tsx',
  'src/components/admin/ui/Input.tsx',
  'src/components/admin/ui/Modal.tsx',
  'src/components/admin/ui/Select.tsx',
  'src/components/admin/ui/Sidebar.tsx',
  'src/components/admin/ui/Table.tsx',
  'src/components/admin/ui/Textarea.tsx',
  'src/components/AuthProvider.tsx',
  'src/components/Header.tsx',
  'src/components/HeroSection.tsx',
  'src/components/InfoCard.tsx',
  'src/components/TimelineCarousel.tsx',
  'src/components/TipTapEditor.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/scroll-area.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/table.tsx',
  'src/components/ui/textarea.tsx',
  'src/lib/api/helpers.ts',
  'src/lib/auth.ts',
  'src/lib/pagination.ts',
  'src/lib/supabase/admin/executiveService.ts',
  'src/lib/supabase/admin/newsService.ts',
  'src/lib/supabase/admin/opportunityService.ts',
  'src/lib/supabase/admin/partnerService.ts',
  'src/lib/supabase/admin/siteSettingsService.ts',
  'src/lib/supabase/adminUserService.ts',
  'src/lib/supabase/pageService.ts',
  'src/lib/validation/admin.ts',
  'src/types/adminContact.ts',
  'test_patch_full.js',
  'test_patch.js'
];

const archiveDir = path.join(__dirname, 'unused_archive');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir);
}

let movedCount = 0;

unusedFiles.forEach(file => {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(archiveDir, file);
  
  if (fs.existsSync(srcPath)) {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(srcPath, destPath);
    console.log(`Moved: ${file}`);
    movedCount++;
  } else {
    console.log(`Not found: ${file}`);
  }
});

console.log(`\nMoved ${movedCount} files to unused_archive/`);
