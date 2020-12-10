# Sample Deployment Steps
While working for my company, there was need to provide documentation between both Development team and Application Support.
This resulted in a Excel workbook to write down all the necessary steps to deploy a web application.
There were some effort to move to a full DevOps pipeline to replace this document.
Below are some highlights to for the various stages; Pre, Deploy, Post, Recovery.

*PRE*
|Type of Activity|Step/Package/Script Name|Notes|
|----|----|----|
|Package Artifact|Build artifact for deployment|
|Backup/Restore DB|Backup/Restore database from Dev.|
|Environment Check|Confirm Netcenter API version match all environments|
|Environment Check|Confirm DotNet Core 2.1.x Runtime installed|
|Environment Check|Confirm DotNet Core environment variable (Development, Staging, Production)|
|Environment Check|IIS CORS Module (installed)|
|Security Check|Add app to Netcenter|
|Security Check|Add roles to Netcenter -> WasteContainer|Admin|
|Security Check|Identified and add users to their various roles|
|Thycotic|Obtain Thycotic Id for appsettings.json|
|Thycotic|Create/Update cache directory|
|Azure DevOps|Create/Update service account for pipeline deployment|
|Azure DevOps|Insure deployment shared directory is created on server|
|DNS|	Ensure that DNS records are created by PMA|
|DNS/Hostname|Ensure the Hostname is included in loopback registry|
|Security Check|Add Users to AD-Group/Rule to allow traffic for port 9090|
||Oracle NET provider|
||SMTP Server settings|
||Add hostname to NetcenterApi(?) allowed URL list|

*Deploy*
|Type of Activity|Step/Package/Script Name|Notes|
|----|----|----|
||Backup Web.config||
||Run TruncateData.sql||
||||

*Post*
|Type of Activity|Step/Package/Script Name|Notes|
|----|----|----|
||Confirm site running with correct environment banner and build number||