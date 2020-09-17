#meta-start
Title:Simple String Encryption
Created:9-1-2020
Category:vba
#meta-end
# Simple String Encryption - VBA
Once I was tasked to convert a FoxPro (DOS version) app into a more modern web application. While working through the program's code, I saw this neat little snippet that convert the password text into a simple group of numbers to help protect the password.

```vb
Sub RUN()
  Let s = "TEST"

  i = 1
  crc = 0
  Do While i < Len(s)
      x = Asc(Mid(s, i, 1)) - 64
      crc = crc + x ^ i + i * x + i
      i = i + 1
  Loop

  Debug.Print crc
End Sub
```