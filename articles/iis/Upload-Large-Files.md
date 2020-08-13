#meta-start
Title:Uploading Large Files in IIS 7+
Created:8-11-2020
Category:iis
#meta-end
# Uploading Large Files in IIS 7+

Resource found [here](http://www.web-site-scripts.com/knowledge-base/article/AA-00696/0/Increasing-maximum-allowed-size-for-uploads-on-IIS7.html)

Apart from general settings that limit the size of files you upload to KMP, IIS7 has its own setting for that. It is "Maximum allowed content length" setting in Request Filtering rules. Follow these steps to increase maximum allowed size for file uploads on IIS7.

* Open IIS Manager.
* Select the "Default Web Site" website on left pane.
* Double-click on "Request Filtering".
* Select "Rules" tab.
* Click "Edit Feature Settings".
* In the dialogue window that opens you can see the "Maximum allowed content length" field. It is set to 30 million bytes by default, which allows you to upload files up to almost 30MB. Let's say we want our files to be up to 1GB, then we would need to put "1073741824" there (this number equals 1GB exactly).
* Also make sure that the "Allow double escaping" option is enabled. It must be enabled for correct downloading of files which names contain a space character.
* Click OK. The new setting is usually applied without restarting IIS.