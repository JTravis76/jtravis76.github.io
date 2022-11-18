# ADO.NET Entity Data Model Missing

[stackoverflow-23046081](http://stackoverflow.com/questions/23046081/missing-ado-net-entity-data-model-on-visual-studio-2013)

Go to "C:\ProgramData\Package Cache" and search for "EFTools.msi".

You should find two files, just install the most recent one (it should be about 960KB / 1.07MB). This fixed the problem for me.