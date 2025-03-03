export default function (number: number, maximumFractionDigits: number = 1) {
    return Intl.NumberFormat('en-AU', { notation: 'compact', maximumFractionDigits }).format(number);
}