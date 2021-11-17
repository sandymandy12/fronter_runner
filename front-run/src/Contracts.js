import { ethers } from 'ethers';

/**
 * Declare the Swap exchance contract interface
 * @param {*} EXCHANGE_ADDRESS address
 * @param {*} SIGNER provider.signer
 * @returns new ethers contract interface
 */
export const ExchangeContract = (EXCHANGE_ADDRESS, SIGNER) => {
    return new ethers.Contract(
        EXCHANGE_ADDRESS,
        ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
        'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
        'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
        SIGNER
    );
}
/**
 * Governance token address (ex. WETH, MATIC, BUSD)
 * @param {*} TOKEN_ADDRESS address
 * @param {*} SIGNER provider.signer
 * @returns contract address
 */
export const TokenContract = (TOKEN_ADDRESS, SIGNER) => {
    return new ethers.Contract(
        TOKEN_ADDRESS,
        ['function balanceOf(address owner) external view returns (uint)',
            'function decimals() external view returns (uint8)',
            'function approve(address spender, uint value) external returns (bool)'
        ],
        SIGNER
      );
};