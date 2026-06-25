Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root "static\logo.png"
$outputPath = Join-Path $root "static\social-card.png"

$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$background = [System.Drawing.Color]::FromArgb(7, 17, 27)
$grid = [System.Drawing.Color]::FromArgb(15, 255, 255, 255)
$gold = [System.Drawing.Color]::FromArgb(243, 200, 75)
$teal = [System.Drawing.Color]::FromArgb(88, 201, 191)
$white = [System.Drawing.Color]::FromArgb(247, 249, 252)
$muted = [System.Drawing.Color]::FromArgb(199, 208, 220)

$graphics.Clear($background)

$gridPen = New-Object System.Drawing.Pen($grid, 1)
for ($x = 0; $x -lt $width; $x += 48) {
    $graphics.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -lt $height; $y += 48) {
    $graphics.DrawLine($gridPen, 0, $y, $width, $y)
}

$accentPen = New-Object System.Drawing.Pen($gold, 8)
$graphics.DrawLine($accentPen, 82, 80, 82, 550)

$source = [System.Drawing.Image]::FromFile($sourcePath)
$avatarRect = New-Object System.Drawing.Rectangle(920, 115, 175, 175)
$cropRect = New-Object System.Drawing.Rectangle(355, 10, 130, 130)
$avatarPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$avatarPath.AddEllipse($avatarRect)
$graphics.SetClip($avatarPath)
$graphics.DrawImage($source, $avatarRect, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$graphics.ResetClip()

$avatarPen = New-Object System.Drawing.Pen($gold, 5)
$graphics.DrawEllipse($avatarPen, $avatarRect)

$brandFont = New-Object System.Drawing.Font("Segoe UI", 58, [System.Drawing.FontStyle]::Bold)
$subFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Regular)
$labelFont = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$brandBrush = New-Object System.Drawing.SolidBrush($white)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)
$tealBrush = New-Object System.Drawing.SolidBrush($teal)

$graphics.DrawString("HEY KAY BUDGETS", $labelFont, $tealBrush, 122, 118)
$graphics.DrawString("Budget with a plan.", $brandFont, $brandBrush, 112, 190)
$graphics.DrawString("Save with less stress.", $brandFont, $brandBrush, 112, 270)
$graphics.DrawString("Beginner-friendly guides and free money tools for real life.", $subFont, $mutedBrush, 118, 390)
$graphics.DrawString("Budget. Save. Pay off debt.", $labelFont, $tealBrush, 118, 485)

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$source.Dispose()
$avatarPath.Dispose()
$avatarPen.Dispose()
$gridPen.Dispose()
$accentPen.Dispose()
$brandFont.Dispose()
$subFont.Dispose()
$labelFont.Dispose()
$brandBrush.Dispose()
$mutedBrush.Dispose()
$tealBrush.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output "Created $outputPath"
