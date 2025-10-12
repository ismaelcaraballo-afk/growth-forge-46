import { Database, Table } from 'lucide-react';

export const DatabaseSchema = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Database Schema</h2>
      </div>

      <div className="space-y-6">
        {/* Books Table */}
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">books</h3>
          </div>
          <div className="space-y-1 text-sm font-mono">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">id</span>
              <span className="text-foreground">uuid (PK)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">user_id</span>
              <span className="text-foreground">uuid (FK → auth.users)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">title</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">author</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">status</span>
              <span className="text-foreground">text (default: 'to-read')</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">rating</span>
              <span className="text-foreground">integer (nullable)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">date_added</span>
              <span className="text-foreground">date</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">tags</span>
              <span className="text-foreground">text[]</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">created_at</span>
              <span className="text-foreground">timestamp</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
            <strong className="text-primary">RLS:</strong> Users can view/edit their own books
          </div>
        </div>

        {/* Jobs Table */}
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">jobs</h3>
          </div>
          <div className="space-y-1 text-sm font-mono">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">id</span>
              <span className="text-foreground">uuid (PK)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">user_id</span>
              <span className="text-foreground">uuid (FK → auth.users)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">company</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">position</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">status</span>
              <span className="text-foreground">text (default: 'applied')</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">date_applied</span>
              <span className="text-foreground">date</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">tags</span>
              <span className="text-foreground">text[]</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">created_at</span>
              <span className="text-foreground">timestamp</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-success/10 rounded text-xs">
            <strong className="text-success">RLS:</strong> Users can view/edit their own jobs
          </div>
        </div>

        {/* Vocabulary Table */}
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-foreground">vocabulary</h3>
          </div>
          <div className="space-y-1 text-sm font-mono">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">id</span>
              <span className="text-foreground">uuid (PK)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">user_id</span>
              <span className="text-foreground">uuid (FK → auth.users)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">word</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">translation</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">language</span>
              <span className="text-foreground">text</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">mastery</span>
              <span className="text-foreground">integer (0-100)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">date_added</span>
              <span className="text-foreground">date</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">tags</span>
              <span className="text-foreground">text[]</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">created_at</span>
              <span className="text-foreground">timestamp</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-purple-500/10 rounded text-xs">
            <strong className="text-purple-500">RLS:</strong> Users can view/edit their own vocabulary
          </div>
        </div>

        {/* Profiles Table */}
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <div className="flex items-center gap-2 mb-3">
            <Table className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground">profiles</h3>
          </div>
          <div className="space-y-1 text-sm font-mono">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">id</span>
              <span className="text-foreground">uuid (PK, FK → auth.users)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">display_name</span>
              <span className="text-foreground">text (nullable)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">created_at</span>
              <span className="text-foreground">timestamp</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">updated_at</span>
              <span className="text-foreground">timestamp</span>
            </div>
          </div>
          <div className="mt-3 p-2 bg-orange-500/10 rounded text-xs">
            <strong className="text-orange-500">RLS:</strong> Users can view/edit their own profile
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2">Security Notes:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>All tables have Row-Level Security (RLS) enabled</li>
          <li>Users can only access their own data</li>
          <li>Authentication required for all operations</li>
          <li>Automatic timestamps for audit trail</li>
        </ul>
      </div>
    </div>
  );
};
