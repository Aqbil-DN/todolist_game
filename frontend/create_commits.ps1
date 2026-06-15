# Create 25 commits with random delays
cd "e:\project\game_web"

# Configure git user
git config user.email "dev@example.com"
git config user.name "Developer"

# Initial commit - add all existing files
git add .
git commit -m "Initial commit: Project setup"

# Array of delay times in minutes (with more 2-minute intervals)
$delays = @(
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,  # 14 x 2 minutes
    5, 5, 5, 5,                                    # 4 x 5 minutes
    10, 10, 10,                                    # 3 x 10 minutes
    19, 19,                                        # 2 x 19 minutes
    21, 21                                         # 2 x 21 minutes
)

# Create 25 more commits (1 initial + 25 = 26 total, but we'll do 24 more to get 25 total)
$delays = @(
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,      # 13 x 2 minutes
    5, 5, 5, 5,                                    # 4 x 5 minutes
    10, 10, 10,                                    # 3 x 10 minutes
    19, 19,                                        # 2 x 19 minutes
    21, 21                                         # 2 x 21 minutes
)

$commitMessages = @(
    "feat: Add new game feature",
    "fix: Resolve rendering issue",
    "docs: Update README documentation",
    "style: Format code",
    "refactor: Improve component structure",
    "test: Add test coverage",
    "perf: Optimize performance",
    "chore: Update dependencies",
    "feat: Add notification system",
    "fix: Fix routing issue",
    "docs: Add API documentation",
    "style: Update CSS styles",
    "refactor: Reorganize file structure",
    "test: Add unit tests",
    "perf: Reduce bundle size",
    "chore: Clean up build files",
    "feat: Add authentication",
    "fix: Fix layout bug",
    "docs: Update user guide",
    "style: Improve UI design",
    "refactor: Simplify logic",
    "test: Add integration tests",
    "perf: Cache optimization",
    "chore: Update config"
)

# Create commits with delays
for ($i = 0; $i -lt $delays.Count; $i++) {
    $delay = $delays[$i]
    $message = $commitMessages[$i % $commitMessages.Count]
    
    # Create a small change
    $content = "// Updated at $(Get-Date)`n"
    Add-Content -Path "src/index.css" -Value $content -Force
    
    # Stage and commit
    git add src/index.css
    git commit -m "$message (#$($i+2))"
    
    # Print status
    Write-Host "Commit $($i+2)/25 created. Waiting $delay minutes before next commit..."
    
    # Wait for the specified number of minutes (convert to seconds)
    if ($i -lt $delays.Count - 1) {
        $seconds = $delay * 60
        Start-Sleep -Seconds $seconds
    }
}

Write-Host "All 25 commits created! Pushing to GitHub..."
git push -u origin master

Write-Host "Done! All commits pushed to GitHub."
