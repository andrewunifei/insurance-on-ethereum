import { expect } from 'chai';
import hh from 'hardhat';
const { ethers } = hh;
import APIArtifact from '../build/artifacts/contracts/mock/mockInsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' }

describe('Smart Contract: mockInsuranceAPI', async () => {
    let APIContract;
    let signer;

    const APIParams = {
        owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    };

    const insuranceParams = {
        institutionName: 'Capital Expansion LTDA'
    };

    beforeEach(async () => {
        signer = await ethers.getSigner();

        const APIFactory = new ethers.ContractFactory(
            APIArtifact.abi,
            APIArtifact.bytecode,
            signer
        );

        APIContract = await APIFactory.deploy.apply(
            APIFactory, Object.values(APIParams)
        );
        await APIContract.deployTransaction.wait(1);
    });

    describe('constructor', async () => {
        it('Should set the parameters correctly', async () => {
            await APIContract.im_owner()
                .then(value => expect(value).to.equal(APIParams.owner));
        });
    });

    describe('createInstitution', async () => {
        it('Should create an Institution correctly', async () => {
            await expect(
                await APIContract.createInstitution(insuranceParams.institutionName)
            ).to.emit(APIContract, 'InstitutionCreated');
            await APIContract.institutions(APIParams.owner, 0)
                .then(value => expect(value.length).to.equal(42));
        });
    });

    describe('getAllInstitution', async () => {
        it('Should return all Institutions from data structure', async () => {
            await APIContract.createInstitution('a');
            await APIContract.createInstitution('b');
            await APIContract.createInstitution('c');
            const data = await APIContract.getAllInstitution();

            expect(data.length).to.equal(3);
            for (const address of data) {
                expect(address.length).to.equal(42);
            }
        });
    });

    describe('donate', async () => {
        it('Should properly associate the donator address with the amount they donated', async () => {
            const tx1 = await signer.sendTransaction(
                {
                    to: APIContract.address,
                    value: ethers.utils.parseEther(String(10))
                }
            );
            await tx1.wait(1);

            const tx2 = await signer.sendTransaction(
                {
                    to: APIContract.address,
                    value: ethers.utils.parseEther(String(10))
                }
            );
            await tx2.wait(1);

            const totalAmountDonated = ethers.utils.parseEther(String(20));
            const data = await APIContract.donators(signer.address);
            expect(data).to.equal(totalAmountDonated);
        })

        it('Should push the donator address to data structure', async () => {
            const tx = await signer.sendTransaction(
                {
                    to: APIContract.address,
                    value: ethers.utils.parseEther(String(10))
                }
            );
            await tx.wait(1);

            const data = await APIContract.donatorsAddresses(0);
            expect(data.length).to.equal(42);
        })
    });

    describe('getAllDonators', async () => {
        it('Should return all donators from data structure', async () => {
            const signers = await ethers.getSigners()

            for(let i = 2; i < 5; i++) {
                const tx = await signers[i].sendTransaction(
                    {
                        to: APIContract.address,
                        value: ethers.utils.parseEther(String(10))
                    }
                );
                await tx.wait(1);
            }

            const data = await APIContract.getAllDonators();

            for(let i = 0; i < 3; i++) {
                expect(data[i].length).to.equal(42);
            }
        })
    })
});