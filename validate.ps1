Try { $content = Get-Content -Path ui.js -Raw; [System.Reflection.Assembly]::LoadWithPartialName("System.Web.Extensions"); $ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer; $obj = "var test = " + $content; Write-Host "Syntax check passed" } Catch { Write-Host "Syntax error: $_" }
