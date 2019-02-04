function Copy-Local2DropBox {
    Param(
        [Parameter(Mandatory=$true)]
        [string]$SourceFilePath,
        [Parameter(Mandatory=$true)]
        [string]$TargetFilePath
    )

    $arg = '{ "path": "' + $TargetFilePath + '", "mode": "add", "autorename": true, "mute": false }'
    $authorization = "Bearer " + (get-item env:DropBoxAccessToken).Value
    
    $headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
    $headers.Add("Authorization", $authorization)
    $headers.Add("Dropbox-API-Arg", $arg)
    $headers.Add("Content-Type", 'application/octet-stream')
    
    Invoke-RestMethod -Uri https://content.dropboxapi.com/2/files/upload -Method Post -InFile $SourceFilePath -Headers $headers
}

function Get-DotCode {
    param($query)

    $url = "http://bing.com?q=flight status for $query"

    $result = Invoke-WebRequest $url

    $result.AllElements | 
        Where Class -eq "ans" |
        Select -First 1 -ExpandProperty innerText    
}