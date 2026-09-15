$source = "C:\Users\LOQ\Documents\LumiREcursion"
$dest = "C:\Users\LOQ\Lumiverse\data\extensions\lumi_recursion\repo"

Write-Host "Syncing Lumi:REcursion to Lumiverse extension directory..."
New-Item -ItemType Directory -Force -Path "$dest\dist" | Out-Null
New-Item -ItemType Directory -Force -Path "$dest\src" | Out-Null

Copy-Item -Force "$source\spindle.json" "$dest\"
Copy-Item -Force "$source\package.json" "$dest\"
Copy-Item -Force -Recurse "$source\dist\*" "$dest\dist\"
Copy-Item -Force -Recurse "$source\src\*" "$dest\src\"

Write-Host "Sync completed successfully!"
