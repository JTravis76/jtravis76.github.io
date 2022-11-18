# Device driver  (code 56)
Recently we upgraded our wifi router from N band to an AC band. About a week later, my step son who is about to graduate college needed to print some forms to fill out.

Now my printer is a Canon MP250 with a T-Link wireless print server. Since the wireless router was switched out, the print server needs to be reconfigured. Performed a factory reset, waited while rebooting, started the easy setup tool that can be with the print server. 

About half-way through the setup, an error was thrown and could not be completed. I attempted again without any success. Told my step-son that he will need to connect the printer directly via usb until I get a chance to look at it. Contine back to work as I was currently teleworking due to the COVID-19. As I was logging back into my company’s network, I noticed that I was offline.

Began researching the problem, resetting network adapters, etc. Then I noticed there was a static IP set on the wireless adapter. Attempted to set it to automatic DHCP, but failed to save with a warning message. I thought to myself, I will just delete the adapter and let Windows rebuild it.

Scanning for devices in Device Manager, nothing happened. Then I saw an option to RESET all network adapters in Windows Settings. Perform the reset then rebooted as suggested. After logging back into the Windows, no network adapters appeared in Network Connections. And found this under Device Manager is the little yellow triangle with the exclamation mark, and Device status of "Windows is still setting up the class configuration for this device. (Code 56)" .

After a bit of searching, I found it was related to VPN virtual networks. Performed all the suggestions found on the internet. Nothing worked. I didn’t want to do a full system recovery. 

While browsing the computer network settings, I ran across a screen that displayed the VMWare VMNET adapters. I manually delete through already under Network Connections. But somehow they continue to be shown. Thinking that the problem was related to the VMNET networks. Since they work like a VPN network based on the information I was reading.

Only thing remaining was to remove every entry found in the Windows registry that contained the word “VMNET”. Fired up a search and then I noticed this section in the registry; HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Network

It seemed that this section contained a list of all network connections my computer ever had. I backed up the node then deleted that whole tree. Rebooted my computer and BAM!! Network adapters restored!!
