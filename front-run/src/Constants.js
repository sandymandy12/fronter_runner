import { ethers } from 'ethers';

/**
 * 
 * @param {*} _chainId 
 * @returns 
 */
export const TokenAddress = (_chainId) => {
    const _address = {
        1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        3: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
    }

    // needs to be checksummed first
    return ethers.utils.getAddress(_address[_chainId]);
}

/**
 * 
 * @param {*} _chainId 
 * @returns 
 */
export const ExchangeAddress = (_chainId) => {
    const _address = {
        1: '',
        3: '',
        137: ''
    }
    
    // needs to be checksummed first
    return ethers.utils.getAddress(_address[_chainId]);
};