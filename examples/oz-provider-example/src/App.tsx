import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from './components/ui/elements';
import {
  CollectorClient,
  CollectorFactoryClient,
  SubscriptionManagerClient
} from 'oz-protocol-sdk/dist/src/client';
import "./App.css";

interface Config {
  rpcUrl: string;
  privateKey: string;
  FactoryContractAddress: string;
  CollectorContractAddress: string;
  SubscriptionManagerContractAddress: string;
}

const App = () => {
  const [config, setConfig] = useState<Config>({
    rpcUrl: process.env.REACT_APP_RPC_URL || '',
    privateKey: process.env.REACT_APP_PRIVATE_KEY || '',
    FactoryContractAddress: process.env.REACT_APP_FACTORY_ADDRESS || '',
    CollectorContractAddress: process.env.REACT_APP_COLLECTOR_ADDRESS || '',
    SubscriptionManagerContractAddress: process.env.REACT_APP_SUB_MANAGER_ADDRESS || ''
  });

  const [clients, setClients] = useState({
    factory: null as CollectorFactoryClient | null,
    collector: null as CollectorClient | null,
    subscription: null as SubscriptionManagerClient | null
  });

  const [status, setStatus] = useState({
    loading: false,
    message: '',
    operation: ''
  });

  const [formData, setFormData] = useState({
    recipientAddress: '',
    nftAddress: '',
    feePerDay: '0',
    collectorFee: '0',
    dataProvider: '',
    recipient: '',
    subscriptionDays: '1',
    collector: '',
    score: '0',
    creatorAddress: '',
    providerAddress: '',
    validity: false,
    tokenId: '0'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  useEffect(() => {
    const initClients = async () => {
      if (config.rpcUrl && config.privateKey && config.FactoryContractAddress) {
        const factory = new CollectorFactoryClient(config.rpcUrl);
        const collector = new CollectorClient(config.rpcUrl);
        const subscription = new SubscriptionManagerClient(config.rpcUrl);

        await Promise.all([
          factory.initialize(config.FactoryContractAddress, config.privateKey),
          collector.initialize(config.CollectorContractAddress, config.privateKey),
          subscription.initialize(config.SubscriptionManagerContractAddress, config.privateKey)
        ]);

        setClients({ factory, collector, subscription });
      }
    };
    initClients();
  }, [config]);

  const handleConfigUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleOperation = async (operation: () => Promise<void>) => {
    try {
      await operation();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        message: error instanceof Error ? error.message : 'Unknown error'
      }));
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Operation implementations
  const operations = {
    mint: () => handleOperation(async () => {
      setStatus({ loading: true, message: '', operation: 'mint' });
      const tx = await clients.collector?.mint(formData.recipientAddress);
      setStatus(prev => ({ ...prev, message: `NFT minted: ${tx}` }));
    }),

    createCollector: () => handleOperation(async () => {
      setStatus({ loading: true, message: '', operation: 'createCollector' });
      const address = await clients.factory?.createCollector(
          formData.nftAddress,
          ethers.parseEther(formData.feePerDay),
          ethers.parseEther(formData.collectorFee)
      );
      setStatus(prev => ({ ...prev, message: `Collector created: ${address}` }));
    }),

    subscribe: () => handleOperation(async () => {
      setStatus({ loading: true, message: '', operation: 'subscribe' });
      const endTime = Math.floor(Date.now() / 1000) + (Number(formData.subscriptionDays) * 86400);
      const fees = await clients.subscription?.calculateFees(Number(formData.subscriptionDays));
      await clients.subscription?.subscribe({
        dataProvider: formData.dataProvider,
        recipient: formData.recipient,
        endTime,
        value: fees!
      });
      setStatus(prev => ({ ...prev, message: 'Subscription created' }));
    }),

    balanceOf: () => handleOperation(async () => {
      const balance = await clients.collector?.balanceOf(formData.recipientAddress);
      setStatus(prev => ({ ...prev, message: `Balance: ${balance}` }));
    }),

    ownerOf: () => handleOperation(async () => {
      const owner = await clients.collector?.ownerOf(Number(formData.tokenId));
      setStatus(prev => ({ ...prev, message: `Owner: ${owner}` }));
    }),

    handleCollectorCreator: (active: boolean) => handleOperation(async () => {
      await clients.factory?.handleCollectorCreator(formData.creatorAddress, active);
      setStatus(prev => ({ ...prev, message: `Creator ${active ? 'added' : 'removed'}` }));
    }),

    handleReputationProvider: (active: boolean) => handleOperation(async () => {
      await clients.factory?.handleReputationProvider(formData.providerAddress, active);
      setStatus(prev => ({ ...prev, message: `Provider ${active ? 'added' : 'removed'}` }));
    }),

    listCollectors: () => handleOperation(async () => {
      const [valid, invalid] = await Promise.all([
        clients.factory?.listCollectorsByValidation(true),
        clients.factory?.listCollectorsByValidation(false)
      ]);
      setStatus(prev => ({ ...prev, message: `Valid: ${valid?.length}, Invalid: ${invalid?.length}` }));
    })
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
        <h1 className="text-4xl font-semibold text-blue-400 mb-8">Collector Protocol Demo</h1>

        <div className="grid gap-6 max-w-7xl mx-auto">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {Object.entries(config).map(([key, value]) => (
                  <div key={key}>
                    <Label>{key}</Label>
                    <Input
                        name={key}
                        value={value}
                        onChange={handleConfigUpdate}
                        className="bg-gray-700"
                    />
                  </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>NFT Operations</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Recipient Address</Label>
                  <Input
                      name="recipientAddress"
                      value={formData.recipientAddress}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <Button
                    onClick={operations.mint}
                    disabled={status.loading}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                  Mint NFT
                </Button>
                <Button
                    onClick={operations.balanceOf}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                  Check Balance
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Data Provider</Label>
                  <Input
                      name="dataProvider"
                      value={formData.dataProvider}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <div>
                  <Label>Recipient</Label>
                  <Input
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <div>
                  <Label>Days</Label>
                  <Input
                      type="number"
                      name="subscriptionDays"
                      value={formData.subscriptionDays}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <Button
                    onClick={operations.subscribe}
                    disabled={status.loading}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                  Create Subscription
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle>Factory Operations</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Creator Address</Label>
                  <Input
                      name="creatorAddress"
                      value={formData.creatorAddress}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <div>
                  <Label>Provider Address</Label>
                  <Input
                      name="providerAddress"
                      value={formData.providerAddress}
                      onChange={handleInputChange}
                      className="bg-gray-700"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                      onClick={() => operations.handleCollectorCreator(true)}
                      className="bg-green-600 hover:bg-green-700"
                  >
                    Add Creator
                  </Button>
                  <Button
                      onClick={() => operations.handleCollectorCreator(false)}
                      className="bg-red-600 hover:bg-red-700"
                  >
                    Remove Creator
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                      onClick={() => operations.handleReputationProvider(true)}
                      className="bg-green-600 hover:bg-green-700"
                  >
                    Add Provider
                  </Button>
                  <Button
                      onClick={() => operations.handleReputationProvider(false)}
                      className="bg-red-600 hover:bg-red-700"
                  >
                    Remove Provider
                  </Button>
                </div>
                <Button
                    onClick={operations.listCollectors}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                  List Collectors
                </Button>
              </CardContent>
            </Card>
          </div>

          {status.message && (
              <div className="mt-4 p-4 bg-gray-800 rounded">
                {status.message}
              </div>
          )}
        </div>
      </div>
  );
};

export default App;
