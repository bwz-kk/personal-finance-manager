export type Language = 'en' | 'pt-BR'

export const LANGUAGES: Language[] = ['en', 'pt-BR']

export interface Translations {
  nav: {
    dashboard: string
    transactions: string
    budgets: string
    investments: string
    planner: string
    goals: string
    market: string
  }
  common: {
    cancel: string
    delete: string
    save: string
    add: string
    comingSoon: string
  }
  errorBoundary: {
    title: string
    message: string
    reload: string
  }
  transactions: {
    title: string
    addTransaction: string
    editTransaction: string
    income: string
    expenses: string
    balance: string
    allTypes: string
    allCategories: string
    fromDate: string
    toDate: string
    search: string
    loading: string
    loadError: string
    empty: string
    columnDate: string
    columnDescription: string
    columnCategory: string
    columnAmount: string
    edit: string
    delete: string
    deleteTitle: string
    deleteMessage: (description: string) => string
    saveChanges: string
    add: string
    typeExpense: string
    typeIncome: string
    amount: string
    description: string
    date: string
    category: string
    selectCategory: string
    notesOptional: string
  }
  categories: {
    title: string
    income: string
    expense: string
    newCategoryName: string
    deleteTitle: string
    deleteMessage: (name: string) => string
  }
  budgets: {
    title: string
    addBudget: string
    editBudget: string
    previousMonth: string
    nextMonth: string
    spent: string
    limit: string
    remaining: string
    overspent: string
    empty: string
    loading: string
    loadError: string
    category: string
    selectCategory: string
    noCategoriesLeft: string
    deleteTitle: string
    deleteMessage: (categoryName: string) => string
  }
  investments: {
    title: string
    addInvestment: string
    editInvestment: string
    name: string
    assetType: string
    institutionOptional: string
    currency: string
    currentValue: string
    currentValueOptional: string
    invested: string
    return: string
    empty: string
    loading: string
    loadError: string
    viewTransactions: string
    hideTransactions: string
    addTransaction: string
    transactionType: string
    amount: string
    quantityOptional: string
    date: string
    noTransactions: string
    deleteTitle: string
    deleteMessage: (name: string) => string
    deleteTransactionTitle: string
    deleteTransactionMessage: string
    portfolioTitle: string
    assetTypes: Record<
      'CDB' | 'TESOURO_DIRETO' | 'STOCK' | 'ETF' | 'CRYPTO' | 'FOREIGN_CURRENCY' | 'OTHER',
      string
    >
    transactionTypes: Record<
      'BUY' | 'SELL' | 'DEPOSIT' | 'WITHDRAWAL' | 'DIVIDEND' | 'INTEREST' | 'OTHER',
      string
    >
  }
  planner: {
    title: string
    disclaimer: string
    income: string
    expenses: string
    expectedRecurring: string
    available: string
    suggested: string
    remainingBuffer: string
    loading: string
    loadError: string
    settings: string
    minMonthlyInvestment: string
    targetInvestmentRate: string
    minCashBuffer: string
    maxPercentOfAvailableCash: string
    expectedRecurringExpenses: string
    saveSettings: string
    settingsSaved: string
    constraints: Record<
      | 'targetRate'
      | 'cappedByBuffer'
      | 'cappedByMaxPercent'
      | 'raisedToMinimum'
      | 'insufficientFunds',
      string
    >
  }
  goals: {
    title: string
    addGoal: string
    editGoal: string
    name: string
    targetAmount: string
    currentAmount: string
    targetDateOptional: string
    remaining: string
    complete: string
    empty: string
    loading: string
    loadError: string
    deleteTitle: string
    deleteMessage: (name: string) => string
  }
  market: {
    title: string
    addItem: string
    symbol: string
    label: string
    assetClass: string
    baseCurrencyOptional: string
    price: string
    lastUpdated: string
    stale: string
    noPriceYet: string
    refresh: string
    refreshAll: string
    empty: string
    loading: string
    loadError: string
    deleteTitle: string
    deleteMessage: (label: string) => string
    assetClasses: Record<'CURRENCY' | 'CRYPTO' | 'STOCK' | 'INDICATOR', string>
  }
  dashboard: {
    title: string
    cashBalance: string
    portfolioValue: string
    income: string
    expenses: string
    invested: string
    available: string
    suggestedInvestment: string
    budgetStatus: string
    recentTransactions: string
    watchlist: string
    incomeVsExpenses: string
    spendingByCategory: string
    monthlyTrend: string
    investmentContributions: string
    portfolioAllocation: string
    noBudgets: string
    noTransactions: string
    noWatchlist: string
    noSpending: string
    noInvestments: string
    loading: string
    loadError: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      budgets: 'Budgets',
      investments: 'Investments',
      planner: 'Planner',
      goals: 'Goals',
      market: 'Market',
    },
    common: {
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      add: 'Add',
      comingSoon: 'Coming in a later phase.',
    },
    errorBoundary: {
      title: 'Something went wrong',
      message: 'This page hit an unexpected error. Your data is safe — try reloading.',
      reload: 'Reload page',
    },
    transactions: {
      title: 'Transactions',
      addTransaction: 'Add transaction',
      editTransaction: 'Edit transaction',
      income: 'Income',
      expenses: 'Expenses',
      balance: 'Balance',
      allTypes: 'All types',
      allCategories: 'All categories',
      fromDate: 'From date',
      toDate: 'To date',
      search: 'Search description or notes',
      loading: 'Loading transactions…',
      loadError: 'Failed to load transactions.',
      empty: 'No transactions match these filters yet.',
      columnDate: 'Date',
      columnDescription: 'Description',
      columnCategory: 'Category',
      columnAmount: 'Amount',
      edit: 'Edit',
      delete: 'Delete',
      deleteTitle: 'Delete transaction',
      deleteMessage: (description) => `Delete "${description}"? This cannot be undone.`,
      saveChanges: 'Save changes',
      add: 'Add transaction',
      typeExpense: 'Expense',
      typeIncome: 'Income',
      amount: 'Amount',
      description: 'Description',
      date: 'Date',
      category: 'Category',
      selectCategory: 'Select a category',
      notesOptional: 'Notes (optional)',
    },
    categories: {
      title: 'Categories',
      income: 'Income',
      expense: 'Expense',
      newCategoryName: 'New category name',
      deleteTitle: 'Delete category',
      deleteMessage: (name) =>
        `Delete "${name}"? This only works if no transactions or budgets use it.`,
    },
    budgets: {
      title: 'Budgets',
      addBudget: 'Add budget',
      editBudget: 'Edit budget',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      spent: 'Spent',
      limit: 'Limit',
      remaining: 'Remaining',
      overspent: 'Over budget',
      empty: 'No budgets set for this month yet.',
      loading: 'Loading budgets…',
      loadError: 'Failed to load budgets.',
      category: 'Category',
      selectCategory: 'Select a category',
      noCategoriesLeft: 'Every expense category already has a budget this month.',
      deleteTitle: 'Delete budget',
      deleteMessage: (categoryName) => `Delete the budget for "${categoryName}"?`,
    },
    investments: {
      title: 'Investments',
      addInvestment: 'Add investment',
      editInvestment: 'Edit investment',
      name: 'Name',
      assetType: 'Asset type',
      institutionOptional: 'Institution (optional)',
      currency: 'Currency',
      currentValue: 'Current value',
      currentValueOptional: 'Current value (optional)',
      invested: 'Invested',
      return: 'Return',
      empty: 'No investments yet.',
      loading: 'Loading investments…',
      loadError: 'Failed to load investments.',
      viewTransactions: 'View transactions',
      hideTransactions: 'Hide transactions',
      addTransaction: 'Add transaction',
      transactionType: 'Type',
      amount: 'Amount',
      quantityOptional: 'Quantity (optional)',
      date: 'Date',
      noTransactions: 'No transactions recorded yet.',
      deleteTitle: 'Delete investment',
      deleteMessage: (name) => `Delete "${name}" and all its transaction history?`,
      deleteTransactionTitle: 'Delete transaction',
      deleteTransactionMessage: 'Delete this transaction? This cannot be undone.',
      portfolioTitle: 'Portfolio',
      assetTypes: {
        CDB: 'CDB',
        TESOURO_DIRETO: 'Tesouro Direto',
        STOCK: 'Stock',
        ETF: 'ETF',
        CRYPTO: 'Crypto',
        FOREIGN_CURRENCY: 'Foreign currency',
        OTHER: 'Other',
      },
      transactionTypes: {
        BUY: 'Buy',
        SELL: 'Sell',
        DEPOSIT: 'Deposit',
        WITHDRAWAL: 'Withdrawal',
        DIVIDEND: 'Dividend',
        INTEREST: 'Interest',
        OTHER: 'Other',
      },
    },
    planner: {
      title: 'Investment Planner',
      disclaimer:
        'This is a configurable calculator over your own numbers, not financial advice. You can always invest a different amount than what’s suggested.',
      income: 'Income',
      expenses: 'Actual expenses',
      expectedRecurring: 'Expected recurring expenses',
      available: 'Available',
      suggested: 'Suggested investment',
      remainingBuffer: 'Remaining buffer',
      loading: 'Calculating…',
      loadError: 'Failed to load the plan.',
      settings: 'Strategy settings',
      minMonthlyInvestment: 'Minimum monthly investment',
      targetInvestmentRate: 'Target investment rate (% of income)',
      minCashBuffer: 'Minimum cash buffer',
      maxPercentOfAvailableCash: 'Max % of available cash to invest',
      expectedRecurringExpenses: 'Expected recurring expenses',
      saveSettings: 'Save settings',
      settingsSaved: 'Settings saved.',
      constraints: {
        targetRate: 'This matches your target investment rate.',
        cappedByBuffer: 'Capped to protect your minimum cash buffer.',
        cappedByMaxPercent: 'Capped by your max % of available cash.',
        raisedToMinimum: 'Raised to your configured minimum monthly investment.',
        insufficientFunds: 'No available cash to invest this month.',
      },
    },
    goals: {
      title: 'Goals',
      addGoal: 'Add goal',
      editGoal: 'Edit goal',
      name: 'Name',
      targetAmount: 'Target amount',
      currentAmount: 'Current amount',
      targetDateOptional: 'Target date (optional)',
      remaining: 'Remaining',
      complete: 'Complete',
      empty: 'No goals yet.',
      loading: 'Loading goals…',
      loadError: 'Failed to load goals.',
      deleteTitle: 'Delete goal',
      deleteMessage: (name) => `Delete "${name}"?`,
    },
    market: {
      title: 'Market',
      addItem: 'Add to watchlist',
      symbol: 'Symbol',
      label: 'Label',
      assetClass: 'Asset class',
      baseCurrencyOptional: 'Base currency (optional, default BRL)',
      price: 'Price',
      lastUpdated: 'Last updated',
      stale: 'Stale',
      noPriceYet: 'No price fetched yet',
      refresh: 'Refresh',
      refreshAll: 'Refresh all',
      empty: 'Your watchlist is empty.',
      loading: 'Loading watchlist…',
      loadError: 'Failed to load the watchlist.',
      deleteTitle: 'Remove from watchlist',
      deleteMessage: (label) => `Remove "${label}" from the watchlist?`,
      assetClasses: {
        CURRENCY: 'Currency',
        CRYPTO: 'Crypto',
        STOCK: 'Stock',
        INDICATOR: 'Indicator',
      },
    },
    dashboard: {
      title: 'Dashboard',
      cashBalance: 'Cash balance',
      portfolioValue: 'Portfolio value',
      income: 'Income',
      expenses: 'Expenses',
      invested: 'Invested',
      available: 'Available',
      suggestedInvestment: 'Suggested investment',
      budgetStatus: 'Budget status',
      recentTransactions: 'Recent transactions',
      watchlist: 'Watchlist',
      incomeVsExpenses: 'Income vs. expenses',
      spendingByCategory: 'Spending by category',
      monthlyTrend: 'Monthly trend',
      investmentContributions: 'Investment contributions',
      portfolioAllocation: 'Portfolio allocation',
      noBudgets: 'No budgets set for this month.',
      noTransactions: 'No transactions yet.',
      noWatchlist: 'Your watchlist is empty.',
      noSpending: 'No spending recorded this month.',
      noInvestments: 'No investments yet.',
      loading: 'Loading dashboard…',
      loadError: 'Failed to load the dashboard.',
    },
  },
  'pt-BR': {
    nav: {
      dashboard: 'Painel',
      transactions: 'Transações',
      budgets: 'Orçamentos',
      investments: 'Investimentos',
      planner: 'Planejador',
      goals: 'Metas',
      market: 'Mercado',
    },
    common: {
      cancel: 'Cancelar',
      delete: 'Excluir',
      save: 'Salvar',
      add: 'Adicionar',
      comingSoon: 'Disponível em uma fase futura.',
    },
    errorBoundary: {
      title: 'Algo deu errado',
      message:
        'Esta página encontrou um erro inesperado. Seus dados estão seguros — tente recarregar.',
      reload: 'Recarregar página',
    },
    transactions: {
      title: 'Transações',
      addTransaction: 'Adicionar transação',
      editTransaction: 'Editar transação',
      income: 'Receitas',
      expenses: 'Despesas',
      balance: 'Saldo',
      allTypes: 'Todos os tipos',
      allCategories: 'Todas as categorias',
      fromDate: 'Data inicial',
      toDate: 'Data final',
      search: 'Buscar descrição ou notas',
      loading: 'Carregando transações…',
      loadError: 'Falha ao carregar transações.',
      empty: 'Nenhuma transação corresponde a esses filtros ainda.',
      columnDate: 'Data',
      columnDescription: 'Descrição',
      columnCategory: 'Categoria',
      columnAmount: 'Valor',
      edit: 'Editar',
      delete: 'Excluir',
      deleteTitle: 'Excluir transação',
      deleteMessage: (description) => `Excluir "${description}"? Isso não pode ser desfeito.`,
      saveChanges: 'Salvar alterações',
      add: 'Adicionar transação',
      typeExpense: 'Despesa',
      typeIncome: 'Receita',
      amount: 'Valor',
      description: 'Descrição',
      date: 'Data',
      category: 'Categoria',
      selectCategory: 'Selecione uma categoria',
      notesOptional: 'Notas (opcional)',
    },
    categories: {
      title: 'Categorias',
      income: 'Receita',
      expense: 'Despesa',
      newCategoryName: 'Nome da nova categoria',
      deleteTitle: 'Excluir categoria',
      deleteMessage: (name) =>
        `Excluir "${name}"? Isso só funciona se nenhuma transação ou orçamento a utilizar.`,
    },
    budgets: {
      title: 'Orçamentos',
      addBudget: 'Adicionar orçamento',
      editBudget: 'Editar orçamento',
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      spent: 'Gasto',
      limit: 'Limite',
      remaining: 'Restante',
      overspent: 'Acima do orçamento',
      empty: 'Nenhum orçamento definido para este mês ainda.',
      loading: 'Carregando orçamentos…',
      loadError: 'Falha ao carregar orçamentos.',
      category: 'Categoria',
      selectCategory: 'Selecione uma categoria',
      noCategoriesLeft: 'Todas as categorias de despesa já têm orçamento este mês.',
      deleteTitle: 'Excluir orçamento',
      deleteMessage: (categoryName) => `Excluir o orçamento de "${categoryName}"?`,
    },
    investments: {
      title: 'Investimentos',
      addInvestment: 'Adicionar investimento',
      editInvestment: 'Editar investimento',
      name: 'Nome',
      assetType: 'Tipo de ativo',
      institutionOptional: 'Instituição (opcional)',
      currency: 'Moeda',
      currentValue: 'Valor atual',
      currentValueOptional: 'Valor atual (opcional)',
      invested: 'Investido',
      return: 'Retorno',
      empty: 'Nenhum investimento ainda.',
      loading: 'Carregando investimentos…',
      loadError: 'Falha ao carregar investimentos.',
      viewTransactions: 'Ver transações',
      hideTransactions: 'Ocultar transações',
      addTransaction: 'Adicionar transação',
      transactionType: 'Tipo',
      amount: 'Valor',
      quantityOptional: 'Quantidade (opcional)',
      date: 'Data',
      noTransactions: 'Nenhuma transação registrada ainda.',
      deleteTitle: 'Excluir investimento',
      deleteMessage: (name) => `Excluir "${name}" e todo seu histórico de transações?`,
      deleteTransactionTitle: 'Excluir transação',
      deleteTransactionMessage: 'Excluir esta transação? Isso não pode ser desfeito.',
      portfolioTitle: 'Carteira',
      assetTypes: {
        CDB: 'CDB',
        TESOURO_DIRETO: 'Tesouro Direto',
        STOCK: 'Ação',
        ETF: 'ETF',
        CRYPTO: 'Cripto',
        FOREIGN_CURRENCY: 'Moeda estrangeira',
        OTHER: 'Outro',
      },
      transactionTypes: {
        BUY: 'Compra',
        SELL: 'Venda',
        DEPOSIT: 'Depósito',
        WITHDRAWAL: 'Saque',
        DIVIDEND: 'Dividendo',
        INTEREST: 'Juros',
        OTHER: 'Outro',
      },
    },
    planner: {
      title: 'Planejador de Investimentos',
      disclaimer:
        'Isso é uma calculadora configurável sobre seus próprios números, não é aconselhamento financeiro. Você sempre pode investir um valor diferente do sugerido.',
      income: 'Receitas',
      expenses: 'Despesas reais',
      expectedRecurring: 'Despesas recorrentes esperadas',
      available: 'Disponível',
      suggested: 'Investimento sugerido',
      remainingBuffer: 'Reserva restante',
      loading: 'Calculando…',
      loadError: 'Falha ao carregar o planejamento.',
      settings: 'Configurações da estratégia',
      minMonthlyInvestment: 'Investimento mínimo mensal',
      targetInvestmentRate: 'Taxa de investimento alvo (% da receita)',
      minCashBuffer: 'Reserva mínima de caixa',
      maxPercentOfAvailableCash: '% máx. do disponível a investir',
      expectedRecurringExpenses: 'Despesas recorrentes esperadas',
      saveSettings: 'Salvar configurações',
      settingsSaved: 'Configurações salvas.',
      constraints: {
        targetRate: 'Isso corresponde à sua taxa de investimento alvo.',
        cappedByBuffer: 'Limitado para proteger sua reserva mínima de caixa.',
        cappedByMaxPercent: 'Limitado pela sua % máxima do disponível.',
        raisedToMinimum: 'Elevado ao investimento mínimo mensal configurado.',
        insufficientFunds: 'Sem caixa disponível para investir este mês.',
      },
    },
    goals: {
      title: 'Metas',
      addGoal: 'Adicionar meta',
      editGoal: 'Editar meta',
      name: 'Nome',
      targetAmount: 'Valor alvo',
      currentAmount: 'Valor atual',
      targetDateOptional: 'Data alvo (opcional)',
      remaining: 'Restante',
      complete: 'Completa',
      empty: 'Nenhuma meta ainda.',
      loading: 'Carregando metas…',
      loadError: 'Falha ao carregar metas.',
      deleteTitle: 'Excluir meta',
      deleteMessage: (name) => `Excluir "${name}"?`,
    },
    market: {
      title: 'Mercado',
      addItem: 'Adicionar à lista de observação',
      symbol: 'Símbolo',
      label: 'Rótulo',
      assetClass: 'Tipo de ativo',
      baseCurrencyOptional: 'Moeda base (opcional, padrão BRL)',
      price: 'Preço',
      lastUpdated: 'Última atualização',
      stale: 'Desatualizado',
      noPriceYet: 'Nenhum preço buscado ainda',
      refresh: 'Atualizar',
      refreshAll: 'Atualizar tudo',
      empty: 'Sua lista de observação está vazia.',
      loading: 'Carregando lista de observação…',
      loadError: 'Falha ao carregar a lista de observação.',
      deleteTitle: 'Remover da lista de observação',
      deleteMessage: (label) => `Remover "${label}" da lista de observação?`,
      assetClasses: {
        CURRENCY: 'Moeda',
        CRYPTO: 'Cripto',
        STOCK: 'Ação',
        INDICATOR: 'Indicador',
      },
    },
    dashboard: {
      title: 'Painel',
      cashBalance: 'Saldo em caixa',
      portfolioValue: 'Valor da carteira',
      income: 'Receitas',
      expenses: 'Despesas',
      invested: 'Investido',
      available: 'Disponível',
      suggestedInvestment: 'Investimento sugerido',
      budgetStatus: 'Status dos orçamentos',
      recentTransactions: 'Transações recentes',
      watchlist: 'Lista de observação',
      incomeVsExpenses: 'Receitas vs. despesas',
      spendingByCategory: 'Gastos por categoria',
      monthlyTrend: 'Tendência mensal',
      investmentContributions: 'Aportes em investimentos',
      portfolioAllocation: 'Alocação da carteira',
      noBudgets: 'Nenhum orçamento definido para este mês.',
      noTransactions: 'Nenhuma transação ainda.',
      noWatchlist: 'Sua lista de observação está vazia.',
      noSpending: 'Nenhum gasto registrado este mês.',
      noInvestments: 'Nenhum investimento ainda.',
      loading: 'Carregando painel…',
      loadError: 'Falha ao carregar o painel.',
    },
  },
}
