// select buttons
let calcuateLoanBtn = document.getElementById('calcuate');
let resetBtn = document.getElementById('reset');

// select text IDs
let loanAmountTxt = document.getElementById('loan-amount-txt');
let interestRateTxt = document.getElementById('interest-rate-txt');
let loanLengthTxt = document.getElementById('loan-length-txt');
let monthlyPymtTxt = document.getElementById('monthly-payments-txt');
let totalInterestTxt = document.getElementById('total-interest-txt');
let totalLoanTxt = document.getElementById('total-loan-txt');

// select Amortization table
let amortizatonTable = document.getElementById('amortization-table');

let atBody = null;

function calcuateMonthlyPmt(loanAmt, interest, loanLength) {
	/* 	
		M= P[r(1+r)^n/((1+r)^n)-1)]
		M = the total monthly payment.
		P = the principal loan amount.
		r = your monthly interest rate. Lenders provide you an annual rate so you’ll need to divide that figure by 12 (the number of months in a year) to get the monthly rate. 
		n = number of payments over the loan’s lifetime. Multiply the number of years in your loan term by 12 (the number of months in a year) to get the number of payments for your loan.
	*/

	// update html text for loan details(loan amount, interest rate, loan length, monthly payments)
	let r = (interest * 0.01) / 12;
	let n = 12 * loanLength;
	let M = loanAmt * (r * Math.pow((1 + r), n) / (Math.pow(1 + r, n) - 1));

	// update html table for amortization schedule
	if (amortizatonTable.lastChild.nodeName == 'TBODY') {
		amortizatonTable.removeChild(atBody);
	}

	// create amortization body table and rows
	atBody = document.createElement('tbody');
	atBody.classList.add('animate__animated');
	atBody.classList.add('animate__slideInUp');

	let loanBalance = loanAmt;
	let totalInterest = 0;

	for (let i = 1; i <= n; i++) {

		let atRow = document.createElement('tr');
		let atPymtCell = document.createElement('td');
		let atInterestCell = document.createElement('td');
		let atPrincipalCell = document.createElement('td');
		let atBalanceCell = document.createElement('td');

		// Principal Payment = Total Monthly Payment – [Outstanding Loan Balance x (Interest Rate / 12 Months)]
		let interestPaid = loanBalance * r;
		let principalPaid = M - interestPaid;
		loanBalance = loanBalance - principalPaid;

		totalInterest += interestPaid;

		atPymtCell.innerText = i;
		atInterestCell.innerText = `$${interestPaid.toFixed(2)}`;
		atPrincipalCell.innerText = `$${principalPaid.toFixed(2)}`;
		atBalanceCell.innerText = (loanBalance > 0) ? `$${loanBalance.toFixed(2)}` : '$0.00';

		atRow.append(atPymtCell, atInterestCell, atPrincipalCell, atBalanceCell);
		atBody.appendChild(atRow);
	}

	// update html loan details

	loanAmountTxt.innerHTML = `$${loanAmt}`;
	interestRateTxt.innerHTML = `${interest}%`;
	loanLengthTxt.innerHTML = `${loanLength} Years`;
	monthlyPymtTxt.innerHTML = `$${M.toFixed(2)} per Month`;

	totalInterestTxt.innerHTML = `$${totalInterest.toFixed(2)}`;
	totalLoanTxt.innerHTML = `$${(loanAmt + totalInterest).toFixed(2)}`;
	amortizatonTable.appendChild(atBody);
}

calcuateLoanBtn.addEventListener('click', function (e) {
	e.preventDefault(); // prevent form submission

	// select input IDs
	let loanAmountInput = parseFloat(document.getElementById('loan-amount-input').value);
	let interestRateInput = parseFloat(document.getElementById('interest-rate-input').value);
	let loanLengthInput = parseFloat(document.getElementById('loan-length-input').value);

	calcuateMonthlyPmt(loanAmountInput, interestRateInput, loanLengthInput);
});

resetBtn.addEventListener('click', function () {
	atBody.classList.add('animate__slideOutDown');
	loanAmountTxt.innerHTML = '$0';
	interestRateTxt.innerHTML = '0%';
	loanLengthTxt.innerHTML = 0;
	monthlyPymtTxt.innerHTML = '$0';
	totalInterestTxt.innerHTML = '$0';
	totalLoanTxt.innerHTML = '$0';

	setTimeout(function () {
		amortizatonTable.removeChild(atBody);
	}, 1000);

});
