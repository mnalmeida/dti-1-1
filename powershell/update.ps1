function Copy-Local2DropBox {
    Param(
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$TargetFilePath
    )

    #$arg = '{ "path": "' + $TargetFilePath + '", "mode": "add", "autorename": true, "mute": false }'
    $arg = '{ "path": "' + $TargetFilePath + '", "mode": "overwrite", "autorename": true, "mute": false }'
    $authorization = "Bearer " + (get-item env:DropBoxAccessToken).Value
    
    $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
    $headers.Add("Authorization", $authorization)
    $headers.Add("Dropbox-API-Arg", $arg)
    $headers.Add("Content-Type", 'application/octet-stream')
    
    Invoke-RestMethod -Uri https://content.dropboxapi.com/2/files/upload -Method Post -InFile $SourceFilePath -Headers $headers
}

function Run-JavaScript {
    Param(
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$OutputFile
    )
    node $SourceFilePath > $OutputFile
}

function Set-Encoding {
    Param (
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$OutputFile
    )
    Get-Content $SourceFilePath | Out-File -Force -Encoding ASCII $OutputFile    
}

function Run-Graphviz {
    Param(
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$OutputFile
    )
    fdp -Tpng $SourceFilePath -o $OutputFile -Lg
}

function Set-ImageSize {
    Param(
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$OutputFile
    )    
    Resize-Image -InputFile $SourceFilePath -Scale 30 -OutputFile $OutputFile
}

Run-JavaScript '.\gsheet_powershell' 'dti-1-1-tmp.dot'
Set-Encoding 'dti-1-1-tmp.dot' 'dti-1-1.dot'
Run-Graphviz 'dti-1-1.dot' 'dti-1-1.png'
# Resize image
Copy-Local2DropBox 'dti-1-1.png' '/public/download.png'