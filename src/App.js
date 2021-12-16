import './App.css';
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './cover.css';
import UAuth from '@uauth/js'
import {NftGallery} from 'react-nft-gallery';

class Helper {
    keyPattern = 'nft_list_';

    getListFor(address) {
        const key = `${this.keyPattern}${address.toLowerCase()}`;
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        } else {
            return {};
        }
    }

    saveListFor(list, address) {
        const key = `${this.keyPattern}${address.toLowerCase()}`;
        localStorage.setItem(key, JSON.stringify(list));
    }
}

function App() {
    const [helper, setHelper] = useState(null);
    const [list, setList] = useState({});
    const [address, setAddress] = useState('');
    const [logged, setLogged] = useState(false);
    const [formAddress, setFormAddress] = useState('');
    const [showList, setShowList] = useState({});

    useEffect(() => {
        const helperInstance = new Helper();
        setHelper(helperInstance);
    }, []);

    function updateList(address) {
        setList(helper.getListFor(address));
    }

    function deleteAddress(owner, address) {
        owner = owner.toLowerCase();
        setList(list => {
            const newList = {
                ...list,
                addresses: list.addresses ? ([...list.addresses.filter(item => item !== address)]) : []
            };
            helper.saveListFor(newList, owner);

            return newList;
        })
    }

    function addAddress(owner, address) {
        owner = owner.toLowerCase();
        setList(list => {
            const newList = {...list, addresses: list.addresses ? ([...list.addresses, address]) : [address]};
            helper.saveListFor(newList, owner);

            return newList;
        })
    }

    async function udLogin() {
        // setLogged(true);
        // setAddress('vitalik.eth');
        // updateList('vitalik.eth');
        // return;
        const uauth = new UAuth({
            clientID: 'z0On4oaYkIkSYoQlZxGTrfpKoICRE12MNrskVNdtFUc=',
            clientSecret: 'P+492fadfh3yfLQEaczQwc31gDC5Ei9ura0Cs+SejL0=',
            redirectUri: 'https://nft-spy.surge.sh/callback',
        })

        try {
            const data = await uauth.loginWithPopup()
            console.log(data)
            const user = data.idToken.sub
            setAddress(user);
            updateList(user);
            setLogged(true);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
            <header className="mb-auto">
                <div>
                    <h3 className="float-md-start mb-0">NFT monitor</h3>
                    <nav className="nav nav-masthead justify-content-center float-md-end">
                        <a className="nav-link active" aria-current="page" href="#">Home</a>
                        <button className="btn btn-outline-warning mx-2" onClick={e => {
                            e.preventDefault();
                            udLogin().then();
                        }}>Enter by UD Domain
                        </button>
                    </nav>
                </div>
            </header>

            {!logged && <main className="px-3">
                <h1>Spy on your favorite NFT artists</h1>
                <p className="lead">
                    This portal makes it super easy to follow your favorite authors. Your list by author is securely
                    stored with reference to your Unstoppable Domain.
                </p>
                <p className="lead">
                    <a href="#" className="btn btn-lg btn-secondary fw-bold border-white bg-white"
                       onClick={e => {
                           e.preventDefault();
                           udLogin().then();
                       }}
                    >
                        Login with UD
                    </a>
                </p>
            </main>}

            {logged && <div>

                <h1>Hello, {address}</h1>

                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Spy address</label>
                        <input type="text" className="form-control" onChange={e => setFormAddress(e.target.value)}
                               value={formAddress}/>
                    </div>

                    <button className="btn btn-primary" onClick={e => {
                        e.preventDefault();
                        addAddress(address, formAddress);
                        setFormAddress('')
                    }
                    }>
                        Spy!
                    </button>
                </form>

                {(list && list.addresses) &&
                    <div className="mt-3 text-start">
                        {list.addresses.map(listAddress => {
                            return <div>
                                <p>{listAddress} - <button className="btn btn-sm btn-outline-primary" onClick={e => {
                                    setShowList(showList => {
                                        return ({...showList, [listAddress]: !showList[listAddress]});
                                    });
                                }
                                }>Toggle NFT
                                    Gallery</button> - <button className="btn btn-sm btn-outline-secondary"
                                                               onClick={e => {
                                                                   if (window.confirm('Really?')) {
                                                                       deleteAddress(address, listAddress)

                                                                   }
                                                               }
                                                               }>Delete</button>
                                </p>

                                {showList[listAddress] && <NftGallery ownerAddress={listAddress}/>}
                            </div>;
                        })}
                    </div>
                }

                {(!list || !list.addresses) &&
                    <p>Enter addresses to spy</p>
                }
            </div>}

            <footer className="mt-auto text-white-50">
                <p>2021</p>
            </footer>
        </div>
    );
}

export default App;
