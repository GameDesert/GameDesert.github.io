inputs = input("Enter numbers as comma (,) separated values: ")
ToSort = ToSort = list(map(int, inputs.split(","))) #Thank you, @Vishnudev of Stack Overflow for helping me with this line!
sorted = ToSort

print("Original: ",sorted)

for largeRepeat in range(0,len(sorted)):
    for Repeat in range(0,len(sorted)-1):
        Number1 = sorted[Repeat]
        Number2 = sorted[Repeat + 1]
        if Number1 > Number2:
            sorted[Repeat] = sorted[Repeat+1]
            sorted[Repeat+1] = Number1



print("Sorted: ",sorted)