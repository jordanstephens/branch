// cycle(0, 1, 3) // => 1
// cycle(1, 1, 3) // => 2
// cycle(2, 1, 3) // => 0
// cycle(0, -1, 3) // => 2
// cycle(1, -1, 3) // => 0
// cycle(2, -1, 3) // => 1
export default function cycle(i, d, n) {
  return (i + (n + d)) % n;
}
