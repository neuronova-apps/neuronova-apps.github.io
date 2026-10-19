param(
  [Parameter(Mandatory=$true)][string]$Destination
)
$ErrorActionPreference = 'Stop'
$repos = @(
  'neuronova-apps.github.io','brailux-app','rutina-go','comunica-go',
  'motiva-app','quizbible-app','mimomento-app','englishfast-app',
  'crucilux-app','sudolux-app'
)
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git no esta instalado.' }
New-Item -ItemType Directory -Path $Destination -Force | Out-Null
$root = (Resolve-Path $Destination).Path
$records = @()
foreach ($name in $repos) {
  $mirror = Join-Path $root ($name + '.git')
  $bundle = Join-Path $root ($name + '.bundle')
  if (Test-Path $mirror -or Test-Path $bundle) {
    throw "Destino ocupado para $name: use una carpeta nueva para evitar reemplazos."
  }
  & git clone --mirror "https://github.com/neuronova-apps/$name.git" "$mirror"
  if ($LASTEXITCODE -ne 0) { throw "Fallo clone mirror: $name" }
  & git -C "$mirror" fsck --full
  if ($LASTEXITCODE -ne 0) { throw "Fallo fsck: $name" }
  & git -C "$mirror" bundle create "$bundle" --all
  if ($LASTEXITCODE -ne 0) { throw "Fallo bundle create: $name" }
  & git -C "$mirror" bundle verify "$bundle"
  if ($LASTEXITCODE -ne 0) { throw "Fallo bundle verify: $name" }
  $hash = (Get-FileHash -Algorithm SHA256 -Path $bundle).Hash
  $refs = & git -C "$mirror" show-ref
  $records += [pscustomobject]@{ repository=$name; bundle=$bundle; bytes=(Get-Item $bundle).Length; sha256=$hash; refs=$refs.Count; verified=$true }
  Write-Host "VERIFICADO: $name"
}
$records | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 (Join-Path $root 'manifest.json')
Write-Host "Respaldo de $($records.Count) repositorios. Manifest: $root\manifest.json"
Write-Warning 'Este procedimiento NO incluye commits existentes solo en clones locales ni cambios sin commit, especialmente RutinaGo.'
