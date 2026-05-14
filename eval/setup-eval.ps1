param(
    [Parameter(Mandatory=$true)]
    [ValidateRange(1,5)]
    [int]$Task,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("bare","harness")]
    [string]$Variant
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$branchName = "eval/T${Task}-${Variant}"

Write-Host "== Eval Setup ==" -ForegroundColor Cyan
Write-Host "Task:     T${Task}"
Write-Host "Variant:  ${Variant}"
Write-Host "Branch:   ${branchName}"
Write-Host "Repo:     ${repoRoot}"
Write-Host ""

$taskFile = Join-Path $repoRoot "eval" "tasks" "T${Task}-*.md"
$matches = Get-ChildItem -Path (Join-Path $repoRoot "eval" "tasks") -Filter "T${Task}-*.md"
if ($matches.Count -eq 0) {
    Write-Host "ERROR: No task file found for T${Task}" -ForegroundColor Red
    exit 1
}
$taskFilePath = $matches[0].FullName
$taskContent = Get-Content $taskFilePath -Raw

$taskPromptMatch = [regex]::Match($taskContent, '(?ms)^## Task Prompt \(for agent\)\s*\r?\n\s*\r?\n>\s*(.+?)(?:\r?\n\r?\n|\z)')
if ($taskPromptMatch.Success) {
    $taskPrompt = $taskPromptMatch.Groups[1].Value.Trim() -replace '(?m)^> ', ''
} else {
    $taskPrompt = "See task file: $taskFilePath"
}

Write-Host "== Task Prompt ==" -ForegroundColor Yellow
Write-Host $taskPrompt
Write-Host ""

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "WARNING: Working tree has uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus
    $response = Read-Host "Continue anyway? (y/N)"
    if ($response -ne 'y') {
        Write-Host "Aborted."
        exit 0
    }
}

$existingBranch = git branch --list $branchName
if ($existingBranch) {
    Write-Host "Branch '$branchName' already exists." -ForegroundColor Yellow
    $response = Read-Host "Delete and recreate? (y/N)"
    if ($response -eq 'y') {
        git branch -D $branchName
    } else {
        Write-Host "Aborted."
        exit 0
    }
}

git checkout -b $branchName
Write-Host ""
Write-Host "Branch '$branchName' created and checked out." -ForegroundColor Green

if ($Variant -eq "harness") {
    Write-Host ""
    Write-Host "== Harness Variant: Run These Steps ==" -ForegroundColor Cyan
    Write-Host "1. devh plan `"$taskPrompt`""
    Write-Host "2. devh context"
    Write-Host "3. <implement the task>"
    Write-Host "4. devh verify"
    Write-Host "5. devh review"
    Write-Host "6. devh summarize"
} else {
    Write-Host ""
    Write-Host "== Bare Variant: Give This Prompt to the Agent ==" -ForegroundColor Cyan
    Write-Host "Copy the task prompt above. Do NOT use devh. Do NOT run devh plan/context/verify/review."
    Write-Host "The agent should work freely using only AGENTS.md for context."
}

Write-Host ""
Write-Host "== After completion ==" -ForegroundColor Cyan
Write-Host "1. Fill in: eval/results/T${Task}-${Variant}.md (copy from eval/scoring-template.md)"
Write-Host "2. Commit results: git add eval/results/ && git commit -m 'eval: T${Task}-${Variant} results'"
Write-Host "3. Return to main: git checkout main"
